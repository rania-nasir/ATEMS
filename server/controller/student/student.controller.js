// Student Sign-In Function
const { sequelize } = require("../../config/sequelize");
const { students } = require("../../model/student.model");
const { generateToken } = require('../../middleware/authMiddleware');
const { announcements } = require('../../model/announcement.model');
const { Op } = require('sequelize');
const { all } = require("../../router/stdRoutes");
const { feedbacks } = require("../../model/feedback.model");


// Sign in function for student
const stdSignIn = async (req, res) => {
  try {
    const rollno = req.body.rollno;
    const password = req.body.password;

    await sequelize.sync();

    const resp = await students.findOne({
      where: {
        rollno: rollno,
        password: password,
      },
    });

    if (resp) {
      const token = generateToken(rollno, 'student'); // generate token based on rollnumber entered
      console.log(`${rollno}, ${password}, `, token); // logging sign in

      const userType = 'student';
      const userId = rollno;
      //console.log('userID: ', userId, ', userType: ', userType);

      res.cookie('jwtoken', token, { // creating cookie
        expiresIn: 3 * 24 * 60 * 60,
        httpOnly: true
      })
      res.status(200).json({ message: 'Student Sign In successfully from Server side', token, userId, userType });
    } else {
      res.json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).json({ message: 'Internal Server Error from Server side' });
  }
};


// Function to get all announcements
const getAnnouncements = async () => {
  try {
    const allAnnouncements = await announcements.findAll({ // fetches all the announcements from the announcement table
      where: {
        announcementType: { [Op.in]: ['Student', 'Both'] }
      },
      attributes: ['announcementTitle', 'announcementContent'],
    });

    return allAnnouncements;
  } catch (error) {
    console.error('Error fetching Announcements:', error);
    res.status(500).json({ error: 'Internal server error 1' }); // error 1 for this function
  }
};

// Function to get only student announcements
const viewStudentAnnouncements = async (req, res) => {
  try {
    const allAnnouncements = await getAnnouncements(); // fetches all student announcements from the announcement table

    res.json({ allAnnouncements });

  } catch (error) {

    console.error('Error loading Announcements:', error);
    res.status(500).json({ error: 'Internal server error 2' }); // error 2 for this function

  }
};

// Function for student to view their feedback 
const viewFeedback = async (req, res) => {
  try {
    const rollno = req.userId
    const feedbackList = await feedbacks.findAll({
      where: {
        rollno: rollno,
        feedbackType: 'MSRC' // Assuming the feedback type for MSRC members is 'MSRC' 
      }
    });
    res.json(feedbackList);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const showStdData = async (req, res) => {
  try {
    const rollno = req.body.rollno; 

    const studentData = await students.findOne({
      where: { rollno },
      attributes: { exclude: ['password'] } 
    });

    if (studentData) {
      res.status(200).json({ data: studentData });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  }
  catch (error) {
     console.error('Error retrieving student data:', error);
    res.status(500).json({ message: 'An error occurred while retrieving student data' });
  }
}

module.exports =
{
  stdSignIn,
  viewStudentAnnouncements,
  viewFeedback,
  showStdData
};
