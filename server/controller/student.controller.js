const { sequelize } = require("../config/sequelize");
const { students } = require("../model/student.model");

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
      console.log(`${rollno}, ${password}`);
      res.status(200).json({ message: 'Student Sign In successfully  from Server side' });
    } else {
      res.json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).json({ message: 'Internal Server Error from Server side' });
  }
};

module.exports = { stdSignIn };
