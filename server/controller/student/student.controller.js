// Student Sign-In Function
const { sequelize } = require("../../config/sequelize");
const { students } = require("../../model/student.model");
const { generateToken } = require('../../middleware/authMiddleware');
const { announcements } = require('../../model/announcement.model');
const { proposalevaluations } = require('../../model/proposalEvaluaton.model');
const { Op } = require('sequelize');
const { all } = require("../../router/stdRoutes");
const { feedbacks } = require("../../model/feedback.model");
const { thesis } = require("../../model/thesis.model");
const { titlerequests } = require("../../model/requestTitle.model");
const { faculties } = require("../../model/faculty.model");
const { supchangerequests } = require("../../model/requestSupervisor.model");


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
      res.json({ message: 'Student Sign In successfully from Server side', token, userId, userType });
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
    const { rollno } = req.params;
    // const rollno = req.body.rollno; 

    const studentData = await students.findOne({
      where: { rollno },
      // attributes: { exclude: ['password'] } 
    });

    if (studentData) {
      res.status(200).json(studentData);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  }
  catch (error) {
    console.error('Error retrieving student data:', error);
    res.status(500).json({ message: 'An error occurred while retrieving student data' });
  }
}


const thesisData = async (req, res) => {
  try {
    const { rollno } = req.params;
    const thesisData = await thesis.findOne({
      where: { rollno },
      attributes: { exclude: ['gcapproval', 'hodapproval', 'gcproposalpermission', 'createdAt', 'updatedAt'] }
    });

    if (thesisData) {
      res.status(200).json(thesisData);
    } else {
      res.status(404).json({ message: 'Thesis request is still in process' });
    }
  }
  catch (error) {
    console.error('Error retrieving thesis data:', error);
    res.status(500).json({ message: 'An error occurred while retrieving thesis data' });
  }

}

const viewTitleChangeFrom = async (req, res) => {
  try {
    const rollno = req.userId;
    console.log('rollno :::', rollno);
    const studentData = await students.findOne({
      where: {
        rollno: rollno
      },
      // attributes: { exclude: ['password'] } 
    });

    if (!studentData) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const thesisData = await thesis.findOne({
      where: {
        rollno: rollno
      },
    });

    if (!thesisData) {
      return res.status(404).json({ message: 'Thesis not found' });
    } else { return res.status(200).json({ message: "Thesis Found" }) }

  } catch (error) {
    console.error('Error submitting title change request : ', error);
    return res.json({ message: 'An error occurred while submitting request for title change' });
  }
}

const requestTitleChange = async (req, res) => {
  try {
    const rollno = req.userId;

    const newThesisTitle = req.body.newThesisTitle;

    const reqData = await titlerequests.findOne({
      where: {
        rollno: rollno
      },
      // attributes: { exclude: ['password'] } 
    });

    if (reqData) {
      return res.json({ message: 'Your Title Change Request has been sent already.' });
    }

    const studentData = await students.findOne({
      where: {
        rollno: rollno
      },
      attributes: ['comingevaluation'],
    });

    if (!studentData) {
      return res.json({ message: 'Student not found' });
    }

    if (studentData.comingevaluation != 'Proposal') {
      return res.json({ message: "Can not request title change after proposal has been accepted" });
    }

    const thesisData = await thesis.findOne({
      where: {
        rollno: rollno
      },
    });

    if (!thesisData) {
      return res.json({ message: 'Thesis not found' });
    }

    if (thesisData) {
      await titlerequests.create({
        thesisid: thesisData.thesisid,
        rollno: rollno,
        stdname: studentData.name,
        email: studentData.email,
        thesisstatus: studentData.thesisstatus,
        currentThesisTitle: thesisData.thesistitle,
        newThesisTitle: newThesisTitle,
        supervisorname: thesisData.supervisorname,
        supervisorid: thesisData.facultyid,
        supervisorReview: 'Pending',
        msrcReview: 'Pending',
      });

      const newtitleChangeRequest = await titlerequests.findOne({ where: { rollno } });
      if (newtitleChangeRequest) {
        return res.json({ message: 'Request for Title change successfully submitted', request: newtitleChangeRequest });
      }
      else {
        return res.json({ message: 'An error occurred while submitting request for title change' });
      }
    } else {
      return res.json({ message: 'Thesis not found' });
    }

  } catch (error) {
    console.error('Error submitting title change request : ', error);
    res.json({ message: 'An error occurred while submitting request for title change' });
  }
}

const viewSupervisorChangeForm = async (req, res) => {
  try {
    const rollno = req.userId;
    const studentData = await students.findOne({
      where: {
        rollno: rollno
      },
      // attributes: { exclude: ['password'] } 
    });

    if (!studentData) {
      return res.json({ message: 'Student not found' });
    }

    const thesisData = await thesis.findOne({
      where: {
        rollno: rollno
      },
    });



    if (!thesisData) {
      return res.json({ message: 'Thesis not found' });
    }

    const supervisorData = await faculties.findOne({
      where: {
        facultyid: thesisData.facultyid.toString()
      }
    })

    if (!supervisorData) {
      return res.json({ message: 'Supervisor not found' });
    }



    let SupervisorList;
    // Fetch the list of all faculties in the table to select for supervisor,

    SupervisorList = await faculties.findAll({
      attributes: ['facultyid', 'name', 'role'],
      where: {
        role: { [Op.contains]: ['Supervisor'] }
      }
    });

    res.json({ SupervisorList });

  } catch (error) {
    console.error('Error viewing supervisor change request : ', error);
    return res.json({ message: 'An error occurred while viewing form for supervisor change' });
  }
}

const requestSupervisorChange = async (req, res) => {
  try {
    const rollno = req.userId;

    const ideaProposalBy = req.body.ideaProposalBy;
    const allowSameTopic = req.body.allowSameTopic;
    const newSupervisorName = req.body.newSupervisorName;
    const comments = req.body.comments;

    const studentData = await students.findOne({
      where: {
        rollno: rollno
      },
      attributes: ['comingevaluation'],
    });

    if (!studentData) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (studentData.comingevaluation != 'Proposal') {
      return res.json({ message: "Can not request supervisor change after proposal has been accepted" });
    }

    const thesisData = await thesis.findOne({
      where: {
        rollno: rollno
      },
    });

    if (!thesisData) {
      return res.json({ message: 'Thesis not found' });
    }

    const Request = await supchangerequests.findOne({ where: { rollno: thesisData.rollno } });
    if (Request) {
      return res.json({ message: 'Your request has been sent already.' });
    }

    const supervisorData = await faculties.findOne({
      where: {
        facultyid: thesisData.facultyid.toString()
      }
    })

    if (!supervisorData) {
      return res.json({ message: 'Supervisor not found' });
    }

    const facultyList = await faculties.findAll({
      attributes: ['facultyid', 'name'],
    });

    const newSupervisorid = facultyList.find(faculty => faculty.name === newSupervisorName)?.facultyid;

    if (!newSupervisorid) {
      return res.json({ message: 'Invalid supervisor name' });
    }
    // Validating that current supervisor and new supervisor are not the same
    if (supervisorData.facultyid === newSupervisorid) {
      return res.json({ message: 'Current Supervisor and New Supervisor must be different' });
    }
    // Validating that new supervisor is not in the internalsid array
    if (thesisData.internalsid[0].toString() === newSupervisorid) {
      return res.json({ message: 'Current internal and New Supervisor must be different' });
    }
    if (thesisData.internalsid[1].toString() === newSupervisorid) {
      return res.json({ message: 'Current internal and New Supervisor must be different' });
    }

    await supchangerequests.create({
      thesisid: thesisData.thesisid,
      rollno: rollno,
      stdname: studentData.name,
      thesisstatus: studentData.thesisstatus,
      ideaproposedby: ideaProposalBy,
      allowsametopic: allowSameTopic,
      currsupervisorname: supervisorData.name,
      currsupervisorid: supervisorData.facultyid,
      newsupervisorname: newSupervisorName,
      newsupervisorid: newSupervisorid,
      initiatorComments: comments,
      currSupReview: 'Approved',
      gcReview: 'Pending',
      hodReview: 'Approved',
    });

    const newSupervisorChangeRequest = await supchangerequests.findOne({ where: { rollno: thesisData.rollno } });
    if (newSupervisorChangeRequest) {
      res.json({ message: 'Request for Supervisor change successfully submitted', request: newSupervisorChangeRequest });
    }

  } catch (error) {
    console.error('Error submitting supervisor change request : ', error);
    res.json({ message: 'An error occurred while submitting request for supervisor change' });
  }
}


module.exports =
{
  stdSignIn,
  viewStudentAnnouncements,
  viewFeedback,
  showStdData,
  thesisData,
  viewTitleChangeFrom,
  requestTitleChange,
  viewSupervisorChangeForm,
  requestSupervisorChange
};
