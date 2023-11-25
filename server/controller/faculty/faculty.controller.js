const { sequelize } = require("../../config/sequelize");
const { faculties } = require("../../model/faculty.model");

/*Faculty controller*/

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
      console.log(`${facultyid}, ${password}`);
      res.status(200).json({ message: 'Sign In successfully  from Server side' });
    } else {
      res.json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error('Failed to retrieve data: ', error);
    res.status(500).json({ message: 'Internal Server Error from Server side' });
  }
};

module.exports = { facultySignIn };
