const { sequelize } = require("../../config/sequelize");
const { faculties } = require("../../model/faculty.model");
const { students } = require("../../model/student.model");
const { announcements } = require("../../model/announcement.model");
const { sendMail } = require("../../config/mailer");
const { generateToken } = require('../../middleware/authMiddleware');
const { Op, Model } = require('sequelize');
const xlsx = require('xlsx');
const { errorMonitor } = require("nodemailer/lib/xoauth2");


//GC login
const GCSignIn = async (req, res) => {
  try {
    const gcid = req.body.gcid;
    const password = req.body.password;
    await sequelize.sync();

    const resp = await faculties.findOne({
      where: {
        facultyid: gcid,
        password: password,
        role: {
          [Op.contains]: ["GC"] // searching in faculties table for GC role
        },
      },
    });

    if (!resp) {
      return res.status(404).json({ error: 'GC Login Forbidden' }); // if role not found on the user entered id and pass then display forbidden message
    }

    if (resp) {
      const token = generateToken(gcid, 'gc'); // create token for gc

      console.log(`${gcid}, ${password}, `, token); // logging sign in
      const userType = 'gc';
      const userId = gcid;
      //console.log('userID: ', userId, ', userType: ', userType);
      res.cookie('jwtoken', token, { // creating cookie
        expiresIn: 3 * 24 * 60 * 60,
        httpOnly: true
      })
      res.status(200).json({ message: 'Sign In successfully from Server side', token, userId, userType });
    } else {
      res.json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).json({ message: 'Internal Server Error from Server side' });
  }
};


// Assigning random password
// Helper function to generate passwords
function generateRandomPassword(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*_'; // creating random password from these characters
  let password = '';
  for (let i = 0; i < length; i++) { // randomizing the characters
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

const uploadStdData = {
  uploadStd: async (req, res) => {
    const file = req.file;
    if (
      file.mimetype !== 'application/vnd.ms-excel' &&
      file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return res.status(400).json({ error: 'Invalid file type. Please upload an Excel file' });
    }
    const filePath = file.path;

    try {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!sheet) {
        return res.status(400).json({ error: 'Student data must be at first excel sheet' });
      }

      const data = xlsx.utils.sheet_to_json(sheet);

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const existingStudent = await students.findOne({
          where: {
            rollno: row.rollno,
          },
        });
        if (!existingStudent) {
          const autoGeneratedPassword = generateRandomPassword(8);
          const studentData = {
            rollno: row.rollno,
            name: row.namee,
            email: row.email,
            gender: row.gender,
            batch: row.batch,
            semester: row.semester,
            program: row.program,
            cgpa: row.cgpa,
            credithours: row.credithours,
            mobile: row.mobile,
            password: autoGeneratedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await students.create(studentData);
          const toEmail = row.email;
          const subject = 'Welcome to ATEMS';
          const text = `Your credentials to login to the system are as follows:
        Username: ${row.rollno}
        Password: ${autoGeneratedPassword}`;
          sendMail(toEmail, subject, text);
        }
      };
      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Error uploading file' });
    }
  },
};


// Upload faculty data via Excel file
const uploadFacData = {
  uploadFac: async (req, res) => {
    const file = req.file;
    if (
      file.mimetype !== 'application/vnd.ms-excel' &&
      file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return res.status(400).json({ error: 'Invalid file type. Please upload an Excel file' });
    }
    const filePath = file.path;

    try {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      if (!sheet) {
        return res.status(400).json({ error: 'Faculty data must be at first excel sheet' });
      }
      const data = xlsx.utils.sheet_to_json(sheet);

      data.forEach(async (row) => {
        const existingFaculty = await faculties.findOne({
          where: { facultyid: String(row.facultyid) }
        });
        if (!existingFaculty) {
          // row.role is a string containing roles separated by commas
          const rolesArray = row.role.split(',');
          const autoGeneratedPassword = generateRandomPassword(8);
          const FacultyData = {
            facultyid: row.facultyid,
            name: row.namee,
            email: row.email,
            gender: row.gender,
            role: rolesArray,
            mobile: row.mobile,
            password: autoGeneratedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await faculties.create(FacultyData);
          const toEmail = row.email;
          const subject = 'Welcome to ATEMS';
          const text = `Your credentials to login to the system are as follows:
        Username: ${row.facultyid}
        Password: ${autoGeneratedPassword}
        Roles: ${rolesArray.join(', ')}`;
          sendMail(toEmail, subject, text);
        }
      });
      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Error uploading file' });
    }
  },
};

// // Add student function
// const addStudent = async (req, res) => {
//   try {
//     const autoGeneratedPassword = generateRandomPassword(8); // using the helper function to generate random passwords
//     const rollno = req.body.rollno;
//     const name = req.body.name;
//     const email = req.body.email;
//     const gender = req.body.gender;
//     const batch = req.body.batch;
//     const semester = req.body.semester;
//     const program = req.body.program;
//     const credithours = req.body.credithours;
//     const cgpa = req.body.cgpa;
//     const mobile = req.body.mobile;
//     const password = autoGeneratedPassword;

//     // Check if student with the same roll number already exists
//     const existingStudent = await students.findOne({ where: { rollno } });
//     if (existingStudent) {
//       return res.status(409).json({ error: "Student with the same roll number already exists" });
//     }

//     /* Validations for Inputs */

//     const rollnoRegex = /^\d{2}[A-Z]-\d{4}$/;
//     if (!rollnoRegex.test(rollno)) {
//       return res.status(400).json({ error: "Invalid roll number format" });
//     }


//     const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ error: "Invalid email format" });
//     }

//     // Validate batch is less than the present year
//     const currentYear = new Date().getFullYear();
//     if (batch >= currentYear) {
//       return res.status(400).json({ error: "Invalid batch year" });
//     }

//     if (cgpa > 4) {
//       return res.status(400).json({ error: "Invalid CGPA. CGPA must be less than or equal to 4" });
//     }

//     // Check eligibility for synopsis registration
//     if (cgpa < 2.5) {
//       return res.status(400).json({ error: "Student is not eligible for synopsis registration" });
//     }

//     if (credithours < 16) {
//       return res.status(400).json({ error: "Credit hours are less than elegible registration criteria" });
//     }
//     const mobileRegex = /^\d{11}$/;
//     if (!mobileRegex.test(mobile)) {
//       return res.status(400).json({ error: "Invalid mobile number format" });
//     }

//     await students.create({ // creating a row in the table with the information
//       rollno: rollno,
//       name: name,
//       email: email,
//       gender: gender,
//       batch: batch,
//       semester: semester,
//       program: program,
//       cgpa: cgpa,
//       credithours: credithours,
//       mobile: mobile,
//       password: password
//     });
//     res.status(200).json('Student record added successfully');

//     // Writing email with password

//     const toEmail = email; // Use the student's email address
//     const subject = 'Weclome to ATEMS';
//     const text = `Your credential to login in to system are as follows:
//     Username :${rollno}
//     Password :${autoGeneratedPassword}`;
//     sendMail(toEmail, subject, text);

//   } catch (error) {
//     console.error('Failed to retrieve data: ', error);
//     res.status(500).json('Internal Server Error');
//   }
// };


// // Adding Faculty members
// const addFaculty = async (req, res) => {
//   try {
//     const autoGeneratedPassword = generateRandomPassword(8); // using helper function to generate password
//     const facultyid = req.body.facultyid;
//     const name = req.body.name;
//     const email = req.body.email;
//     const gender = req.body.gender;
//     const role = req.body.role;
//     const mobile = req.body.mobile;
//     const password = autoGeneratedPassword;

//     /* Validations */

//     const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ error: "Invalid email format" });
//     }

//     const mobileRegex = /^\d{11}$/;
//     if (!mobileRegex.test(mobile)) {
//       return res.status(400).json({ error: "Invalid mobile number format" });
//     }

//     const facultyIdRegex = /^\d{4}$/;
//     if (!facultyIdRegex.test(facultyid)) {
//       return res.status(400).json({ error: "Invalid faculty ID format" });
//     }

//     await faculties.create({
//       facultyid: facultyid,
//       name: name,
//       email: email,
//       gender: gender,
//       role: role,
//       mobile: mobile,
//       password: password
//     });
//     res.status(200).json('Faculty record added successfully');

//     //Writing email with generated password
//     const toEmail = email; // Use the faulty's email address
//     const subject = 'Weclome to ATEMS';
//     const text = `Your credential to login in to system are as follows:
//     Username :${facultyid}
//     Password :${autoGeneratedPassword}`;
//     sendMail(toEmail, subject, text);

//   } catch (error) {
//     console.error('Failed to retrieve data: ', error);
//     res.status(500).json('Internal Server Error');
//   }
// }


// Add Announcement
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
        const subject = announcementTitle;
        const text = announcementContent.slice(0, 50);
        sendMail(toEmail, subject, text);
      });
    }

    if (announcementType === 'Faculty' || announcementType === 'Both') {
      const Faculties = await faculties.findAll();

      // Send email to all faculties
      Faculties.forEach((faculty) => {
        const toEmail = faculty.email;
        const subject = announcementTitle;
        const text = announcementContent.slice(0, 50) + "........ Check the system to see full announcement";
        sendMail(toEmail, subject, text);
      });
    }

    res.status(200).json('Announcement record added successfully');
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).json('Internal Server Error');
  }
};


// View All Faculty Members
const viewFaculty = async (req, res) => {
  try {
    const facultyMembers = await faculties.findAll({
      attributes: ['facultyid', 'name', 'email', 'role']
    });
    res.json(facultyMembers);
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).json('Internal Server Error');
  }
};


// View All Present students in the system
const viewStudents = async (req, res) => {
  try {
    const studentsnData = await students.findAll({
      attributes: ['rollno', 'name', 'email', 'batch', 'semester', 'program', 'cgpa']
    });
    res.json(studentsnData);
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).send.json('Internal Server Error');
  }
}


const updateStudent = async (req, res) => {
  try {
    const rollno = req.params.rollno;
    const updatedData = req.body;
    delete updatedData.password;
    delete updatedData.rollno;
   

    const [updatedRowsCount, updatedStudents] = await students.update(updatedData, {
      where: { rollno },
      returning: true, // to ensures that the updated student data is returned

    });
    const sanitizedUpdatedStudents = updatedStudents.map(student => {
      const { password, ...sanitizedStudentData } = student.dataValues;
      return sanitizedStudentData;
    });

    if (updatedRowsCount > 0) {
      res.status(200).json({ message: 'Student data updated successfully', data: sanitizedUpdatedStudents });
    } else {
      res.status(404).json({ message: 'Student with the specified roll number not found' });
    }
  } catch (error) {
    // any errors during the update operation
    console.error('Error updating student data:', error);
    res.status(500).json({ message: 'An error occurred while updating student data' });
  }
}


const updateFaculty = async (req, res) => {
  try {
    const facultyid = req.params.facultyid;
    const updatedData = req.body;
    delete updatedData.password;
    delete updatedData.facultyid;

    //asynchronous update operation
    const [updatedRowsCount, updatedFaculties] = await faculties.update(updatedData, {
      where: { facultyid },
      returning: true, // to ensures that the updated faculty data is returned
    });

    const sanitizedUpdatedFaculties = updatedFaculties.map(faculty => {
      const { password, ...sanitizedFacultyData } = faculty.dataValues;
      return sanitizedFacultyData;
    });

    if (updatedRowsCount > 0) {
      res.status(200).json({ message: 'Faculty data updated successfully', data: sanitizedUpdatedFaculties });
    } else {
      res.status(404).json({ message: 'Faculty with the specified faculty ID not found' });
    }

  } catch (error) {
    // any errors during the update operation
    console.error('Error updating faculty data:', error);
    res.status(500).json({ message: 'An error occurred while updating faculty data' });
  }
}


// Delete Student
const deleteStudent = async (req, res) => {
  try {
    const rollno = req.params.rollno;

    //asynchronous delete operation
    const deletedRowsCount = await students.destroy({
      where: { rollno },
    });

    if (deletedRowsCount > 0) {
      res.status(200).json({ message: 'Student deleted successfully' });
    } else {
      res.status(404).json({ message: 'Student with the specified roll number not found' });
    }
  } catch (error) {
    // any errors during the delete operation
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'An error occurred while deleting student' });
  }
}


// Delete Faculty
const deleteFaculty = async (req, res) => {
  try {
    const facultyid = req.params.facultyid;

    // Assuming you are using a database, you can perform an asynchronous delete operation
    const deletedRowsCount = await faculties.destroy({
      where: { facultyid },
    });

    if (deletedRowsCount > 0) {
      res.status(200).json({ message: 'Faculty member deleted successfully' });
    } else {
      res.status(404).json({ message: 'Faculty member with the specified faculty ID not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the delete operation
    console.error('Error deleting faculty member:', error);
    res.status(500).json({ message: 'An error occurred while deleting faculty member' });
  }
}

const showgcData = async (req, res) => {
  try {
    const { gcid } = req.params;
    
    const gcData = await faculties.findOne({
      where: { facultyid: gcid }, 
      role: {
        [Op.contains]: ["GC"] // searching in faculties table for GC role
      },
      // attributes: { exclude: ['password'] }
    });

    if (gcData) {
      res.status(200).json(gcData);
    } else {
      res.status(404).json({ message: 'Faculty member not found' });
    }
  } catch (error) {

    console.error('Error retrieving faculty data:', error);
    res.status(500).json({ message: 'An error occurred while retrieving faculty data' });
  }
}

module.exports =
{
  GCSignIn,
  //addStudent,
  uploadStdData,
  uploadFacData,
  viewStudents,
  //addFaculty,
  viewFaculty,
  addAnnouncement,
  updateStudent,
  updateFaculty,
  deleteStudent,
  deleteFaculty,
  showgcData
};
