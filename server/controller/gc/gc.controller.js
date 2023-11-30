const { sequelize } = require("../../config/sequelize");
const { faculties } = require("../../model/faculty.model");
const { students } = require("../../model/student.model");
const { announcements } = require("../../model/announcement.model");
const { sendMail } = require("../../config/mailer");


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

    const mobileRegex = /^\d{11}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ error: "Invalid mobile number format" });
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
    res.status(200).json('Student record added successfully');
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).json('Internal Server Error');
  }
};

const viewStudents = async (req, res) => {
  try {
    const studentsnData = await students.findAll({
      attributes: ['rollno', 'name', 'batch', 'semester', 'program', 'cgpa']
    });
    res.json(studentsnData);
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).send.json('Internal Server Error');
  }
}

const addFaculty = async (req, res) => {
  try {
    const facultyid = req.body.facultyid;
    const name = req.body.name;
    const email = req.body.email;
    const gender = req.body.gender;
    const role = req.body.role;
    const mobile = req.body.mobile;
    const password = req.body.password;

    // Validate email
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    
    const mobileRegex = /^\d{11}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ error: "Invalid mobile number format" });
    }

    await faculties.create({
      facultyid: facultyid,
      name: name,
      email: email,
      gender: gender,
      role: role,
      mobile: mobile,
      password: password
    });
    res.status(200).json('Faculty record added successfully');
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).json('Internal Server Error');
  }
}

const viewFaculty = async (req, res) => {
  try {
    const facultyMembers = await faculties.findAll({
      attributes: ['facultyid', 'name', 'email']
    });
    res.json(facultyMembers);
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).json('Internal Server Error');
  }
};

const addAnnouncement = async (req, res) => {
  try {
    const announcementID = req.body.announcementID;
    const announcementType = req.body.announcementType;
    const announcementTitle = req.body.announcementTitle;
    const announcementContent = req.body.announcementContent;
 
    await announcements.create({
      announcementID,
      announcementType,
      announcementTitle,
      announcementContent
    });

    if (announcementType === 'Student' || announcementType === 'Both') {
      const Students = await students.findAll();
      // Send email to all students
      Students.forEach((student) => {
        const toEmail = student.email;
        const subject = 'New Announcement';
        const text = 'An announcement has been added to the system.';
        sendMail(toEmail, subject, text);
      });
    }

    if (announcementType === 'Faculty' || announcementType === 'Both') {
      const Faculties = await faculties.findAll();
      // Send email to all faculties
      Faculties.forEach((faculty) => {
        const toEmail = faculty.email;
        const subject = 'New Announcement';
        const text = 'An announcement has been added to the system.';
        sendMail(toEmail, subject, text);
      });
    }
    
    res.status(200).json('Announcement record added successfully');
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).json('Internal Server Error');
  }
};

module.exports =
{
  addStudent, 
  viewStudents,
  addFaculty,
  viewFaculty,
  addAnnouncement
};
