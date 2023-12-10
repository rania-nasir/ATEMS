// Faculty Sign-In Function
const { sequelize } = require("../../config/sequelize");
const { faculties } = require("../../model/faculty.model");
const { generateToken } = require('../../middleware/authMiddleware');
const { announcements } = require('../../model/announcement.model');
const { Op } = require('sequelize');

const facultySignIn = async (req, res) => {
  try {
    const facultyid = req.body.facultyid;
    const password = req.body.password;
    await sequelize.sync();

    const resp = await faculties.findOne({
      where: {
        facultyid: facultyid,
        password: password,
      },
    });

    if (resp) {
      const token = generateToken(facultyid, 'faculty');

      console.log(`${facultyid}, ${password}, `, token);
      const userType = 'faculty'; // Assuming it's a faculty login
      const userId = facultyid; // Assuming the faculty ID is used as the user ID
      console.log('userID: ', userId, ', userType: ', userType);
      res.cookie('jwtoken', token, {
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

const getAnnouncements = async () => {
  try {
      const allAnnouncements = await announcements.findAll({
        where: {
          announcementType: { [Op.in]: ['Faculty', 'Both'] }
        }, 
        attributes: ['announcementTitle', 'announcementContent'],
      });

      return allAnnouncements;
  } catch (error) {
      console.error('Error fetching Announcements:', error);
      throw error;
  }
};


const viewFacultyAnnouncements = async (req, res) => {
  try {
    
      console.log('Passed');
      const allAnnouncements = await getAnnouncements();

      res.json({ allAnnouncements });

  } catch (error) {

      console.error('Error loading Announcements:', error);
      res.status(500).json({ error: 'Internal server error 1' }); // error 1 for this function
      
  }
};

module.exports = 
{ 
  facultySignIn,
  viewFacultyAnnouncements
};
