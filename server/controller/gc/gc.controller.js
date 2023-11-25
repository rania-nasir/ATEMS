const { sequelize } = require("../../config/sequelize");
//const { faculties } = require("../model/faculty.model");
const { students } = require("../../model/student.model");
//const { announcements } = require("../model/announcement.model");


const addStudent = async (req, res) => {
  try {
    const rollno = req.body.rollno;
    const name = req.body.name;
    const email = req.body.email;
    const gender = req.body.gender;
    const batch = req.body.batch;
    const semester = req.body.semester;
    const program = req.body.program;
    const cgpa = req.body.cgpa;
    const mobile = req.body.mobile;
    const password = req.body.password;

    // Check if student with the same roll number already exists
    const existingStudent = await students.findOne({ where: { rollno } });
    if (existingStudent) {
      return res.status(409).json({ error: "Student with the same roll number already exists" });
    }

     // Validate roll number
    const rollnoRegex = /^\d{2}[A-Z]-\d{4}$/;
    if (!rollnoRegex.test(rollno)) {
      return res.status(400).json({ error: "Invalid roll number format" });
    }

    // Validate email
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate batch is less than the present year
    const currentYear = new Date().getFullYear();
    if (batch >= currentYear) {
      return res.status(400).json({ error: "Invalid batch year" });
    }

    if (cgpa > 4) {
      return res.status(400).json({ error: "Invalid CGPA. CGPA must be less than or equal to 4" });
    }

    // Check eligibility for synopsis registration
    if (cgpa < 2) {
      return res.status(400).json({ error: "Student is not eligible for synopsis registration" });
    }

    await students.create({
      rollno: rollno,
      name: name,
      email: email,
      gender: gender,
      batch: batch,
      semester: semester,
      program: program,
      cgpa: cgpa,
      mobile: mobile,
      password: password
    });
    res.status(200).send('Student record added successfully');
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports =
{
  addStudent
};
