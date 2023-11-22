const { sequelize } = require("../config/sequelize");
const { faculties } = require("../model/faculty.model");

const gcSignIn = async (req, res) => {
  try {
    console.log(`1111111111111`);
    const facultyid = req.body.facultyid;
    const password = req.body.password;
    console.log(`${facultyid}, ${password}`);
    await sequelize.sync();
    

    const resp = await faculties.findOne({
      where: {
          facultyid: facultyid,
          password: password,
        },
    });

    if (resp) {
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
