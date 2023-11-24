const { sequelize } = require("../config/sequelize");
const { faculties } = require("../model/faculty.model");

const gcSignIn = async (req, res) => {
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
      console.log(`${facultyid}, ${password}`);
      res.send('Sign In successfully');
    } else {
      res.send('Invalid Credentials');
    }
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { gcSignIn };
