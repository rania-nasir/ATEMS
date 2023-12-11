// Student Sign-In Function
const { sequelize } = require("../../config/sequelize");
const { students } = require("../../model/student.model");
const { generateToken } = require('../../middleware/authMiddleware');
const { announcements } = require('../../model/announcement.model');
const { Op } = require('sequelize');
const { all } = require("../../router/stdRoutes");
const { feedbacks } = require("../../model/feedback.model");

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
      const token = generateToken(rollno, 'student');
      console.log(`${rollno}, ${password}, `, token);
      const userType = 'student'; // Assuming it's a student login
      const userId = rollno; // Assuming the student ID is used as the user ID
      console.log('userID: ', userId, ', userType: ', userType);
      res.cookie('jwtoken', token, {
        expiresIn: 3 * 24 * 60 * 60,
        httpOnly: true
      })
      res.status(200).json({ message: 'Student Sign In successfully from Server side', token, userId, userType  });
    } else {
      res.json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).json({ message: 'Internal Server Error from Server side' });
  }
};



const getAnnouncements = async () => {
  try {
      const allAnnouncements = await announcements.findAll({
        where: {
          announcementType: { [Op.in]: ['Student', 'Both'] }
        }, 
        attributes: ['announcementTitle', 'announcementContent'],
      });

      return allAnnouncements;
  } catch (error) {
      console.error('Error fetching Announcements:', error);
      throw error;
  }
};


const viewStudentAnnouncements = async (req, res) => {
  try {
    
      console.log('Passed');
      const allAnnouncements = await getAnnouncements();

      res.json({ allAnnouncements });

  } catch (error) {

      console.error('Error loading Announcements:', error);
      res.status(500).json({ error: 'Internal server error 1' }); // error 1 for this function
      
  }
};

const viewFeedback = async (req, res) => {
  try {
    const rollno = req.userId; // Assuming the student ID is used as the user ID
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

module.exports = 
{ 
  stdSignIn, 
  viewStudentAnnouncements,
  viewFeedback
};
