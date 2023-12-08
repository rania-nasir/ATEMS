// Student Sign-In Function
const { sequelize } = require("../../config/sequelize");
const { students } = require("../../model/student.model");
const { generateToken } = require('../../middleware/authMiddleware');

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
      const userType = 'student'; // Assuming it's a faculty login
      const userId = rollno; // Assuming the faculty ID is used as the user ID
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

module.exports = { stdSignIn };
