// Faculty Sign-In Function
const { sequelize } = require("../../config/sequelize");
const { faculties } = require("../../model/faculty.model");
const { generateToken } = require('../../middleware/authMiddleware');
const { announcements } = require('../../model/announcement.model');
const { Op } = require('sequelize');


// Sign in function for Faculty
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
      const token = generateToken(facultyid, 'faculty'); // generating token for faculty id

      console.log(`${facultyid}, ${password}, `, token); // logging sign in
      const userType = 'faculty';
      const userId = facultyid;
      //console.log('userID: ', userId, ', userType: ', userType);
      res.cookie('jwtoken', token, { // Creating cookie
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

// Helper function to get all Announcements
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

// Function to display all Faculty Announcements
const viewFacultyAnnouncements = async (req, res) => {
  try {
    const allAnnouncements = await getAnnouncements(); // uses helper function to get all announcements

    res.json({ allAnnouncements });

  } catch (error) {

    console.error('Error loading Announcements:', error);
    res.status(500).json({ error: 'Internal server error 1' }); // error 1 for this function

  }
};

const showFacData = async (req, res) => {
  try {
    const facultyid = req.body.facultyid;
    const facultyData = await faculties.findOne({
      where: { facultyid },
      attributes: { exclude: ['password'] } 
    });

    if (facultyData) {
      res.status(200).json({ data: facultyData });
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
  facultySignIn,
  viewFacultyAnnouncements,
  showFacData
};
