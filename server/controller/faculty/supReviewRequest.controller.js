const { sequelize } = require("../../config/sequelize");
const { synopsis } = require("../../model/synopsis.model");
const { thesis } = require("../../model/thesis.model");
const { faculties } = require("../../model/faculty.model");
const { students } = require("../../model/student.model");
const { sendMail } = require("../../config/mailer");
const { Op, Model } = require('sequelize');


/* Supervisor Review Requests Controller */
/* Review Requests using synopsis submitted by Students */

// fetch all synopsis for the logged in supervisor
const getSynopsis = async (req, res) => {
    try {

        const facultyId = req.userId; // obtain the logged in faculty id.

        const allSynopsis = await synopsis.findAll({
            where: {
                facultyid: facultyId,
                synopsisstatus: 'Pending' // fetch only those where status is Pending
            },
            attributes: ['synopsisid', 'rollno', 'synopsistitle', 'potentialareas'],
        });

        res.json({ allSynopsis });

    } catch (error) {
        console.error('Error fetching synopsis for review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Fetch Synopsis details for a single synopsis
const getSynopsisDetails = async (req, res) => {
    try {

        const { synopsisId } = req.params; // Faculty will choose an id for review
        const facultyId = req.userId; // obtain the logged in faculty id.

        const selectedSynopsis = await synopsis.findOne({
            where: {
                synopsisid: synopsisId,
                facultyid: facultyId
            },
        });

        const facultyList = await faculties.findAll({ // fetch the list of all faculties in the table to select for internal
            attributes: ['facultyid', 'name', 'role'],
            where: {
                role: { [Op.contains]: ['Internal'] }
            }
        });

        if (!selectedSynopsis) {
            return res.status(404).json({ error: 'Synopsis not found' });
        }

        const fileURL = `/uploads/${selectedSynopsis.proposalfilename}`; // Construct the file URL
        selectedSynopsis.dataValues.fileURL = fileURL; // Add the file URL to the selectedSynopsis object

        res.json({ selectedSynopsis, facultyList });

    } catch (error) {
        console.error('Error fetching synopsis details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Approve The selected synopsis
const approveSynopsis = async (req, res) => {
    try {
        const { synopsisId } = req.params;
        const facultyId = req.userId;
        const { internal1, internal2, researcharea1, researcharea2 } = req.body; // fetch the names of the internals from the frontend
        //console.log('Internals are : ', internal1, ', ', internal2)

        const existingApprovedSynopsis = await synopsis.findOne({ // check for existing approved synopsis, if it is already existing display error
            where: {
                synopsisid: synopsisId,
                synopsisstatus: 'Approved'
            }
        });

        if (existingApprovedSynopsis) {
            return res.status(400).json({ error: 'A request with the same synopsis ID already exists' }); // error
        }

        const selectedSynopsis = await synopsis.findOne({
            where: {
                synopsisid: synopsisId,
                facultyid: facultyId
            },
        });

        if (!selectedSynopsis) {
            return res.status(404).json({ error: 'Synopsis not found or not authorized' });
        }


        const student = await students.findOne({ // get student details for mail from rollno in synopsis table
            where: {
                rollno: selectedSynopsis.rollno.toString()
            }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found for the given synopsis' });
        }

        // Validating student email
        const studentEmail = student.email;
        if (!studentEmail || !/^.+@.+\..+$/.test(studentEmail)) {
            return res.status(400).json({ error: 'Invalid student email address' });
        }
        console.log(studentEmail);


        const facultyList = await faculties.findAll({
            attributes: ['facultyid', 'name'],
        });

        //console.log('Faculty List:', facultyList);


        // fetch id of the faculty members chosen as internals through name
        const internal1id = facultyList.find(faculty => faculty.name === internal1)?.facultyid;
        const internal2id = facultyList.find(faculty => faculty.name === internal2)?.facultyid;

        if (!internal1id || !internal2id) {
            return res.status(400).json({ error: 'Invalid internal faculty names' });
        }

        // Validating that supervisor and internal members are not the same
        if (facultyId === internal1id || facultyId === internal2id || internal1id === internal2id) {
            return res.status(400).json({ error: 'Supervisor and Internals must be different for a thesis' });
        }


        const [rowsAffected, [updatedSynopsis]] = await synopsis.update( // update synopsis status from pending to approved 
            {
                synopsisstatus: 'Approved'
            },
            {
                where: {
                    synopsisid: synopsisId,
                    facultyid: facultyId
                },
                returning: true,
            }
        );

        if (rowsAffected === 0) {
            return res.status(404).json({ error: 'Synopsis not found or not authorized for approval' });
        }




        console.log(researcharea1, researcharea2)
        const newThesis = await thesis.create({ // Create thesis with internal members name and id and set status to pending
            thesistitle: selectedSynopsis.synopsistitle,
            rollno: selectedSynopsis.rollno,
            facultyid: selectedSynopsis.facultyid,
            internals: [internal1, internal2],
            internalsid: [internal1id, internal2id],
            researcharea: [researcharea1, researcharea2],
            potentialareas: selectedSynopsis.potentialareas,
            proposalfilename: selectedSynopsis.proposalfilename,
            gcApproval: 'Pending',
            hodapproval: 'Pending',
        });



        // Send mail of Approval to student
        const facultyName = selectedSynopsis.facultyname;
        const toEmail = studentEmail;
        const subject = 'Synopsis Approved';
        const text = `Dear Student,

        Your synopsis has been accepted by ${facultyName} (Faculty ID: ${facultyId}).
        Your thesis internal examineers will be ${internal1} and ${internal2}.

        Your request is being forwarded to Graduate Coordinator.
        Regards,`;

        sendMail(toEmail, subject, text);

        res.json({ message: 'Internal members selected successfully and Synopsis approved', thesis: newThesis });

    } catch (error) {
        console.error('Error approving synopsis or selecting internal members:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to decline the selected Synopsis
const declineSynopsis = async (req, res) => {
    try {
        const { synopsisId } = req.params;
        const facultyId = req.userId;

        const selectedSynopsis = await synopsis.findOne({ // See if the synopsis being rejected is pending
            where: {
                synopsisid: synopsisId,
                synopsisstatus: 'Pending'
            }
        });

        if (!selectedSynopsis) {
            return res.status(404).json({ error: 'Synopsis not found for the given synopsisID' });
        }
        const student = await students.findOne({ // get student details for mail from rollno in synopsis table
            where: {
                rollno: selectedSynopsis.rollno.toString()
            }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found for the given synopsis' });
        }

        /* Validations */
        const studentEmail = student.email;
        if (!studentEmail || !/^.+@.+\..+$/.test(studentEmail)) {
            return res.status(400).json({ error: 'Invalid student email address' });
        }
        console.log(studentEmail);

        const faculty = await faculties.findOne({ // Get faculty
            where: {
                facultyid: facultyId
            },
            attributes: ['name']
        });

        if (!faculty) {
            return res.status(404).json({ error: 'Faculty not found for the given ID' });
        }

        // Send mail of Rejection to student
        const facultyName = faculty.name;
        const toEmail = studentEmail;
        const subject = 'Synopsis Rejected';
        const text = `Dear Student,

        Your synopsis has been rejected by ${facultyName} (Faculty ID: ${facultyId}). Please fill another synopsis form.

        Regards,`;

        sendMail(toEmail, subject, text);

        const deletedSynopsis = await synopsis.destroy({
            where: {
                synopsisid: synopsisId,
                facultyid: facultyId
            }
        });

        if (deletedSynopsis === 0) {
            return res.status(404).json({ error: 'Synopsis not found or not authorized for rejection' });
        }

        res.json({ message: 'Synopsis rejected successfully and deleted from the synopsis table' });

    } catch (error) {
        console.error('Error declining synopsis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const allProposalEvalations = async (req, res) => {
    try {
        const loggedInFacultyId = parseInt(req.userId);
        
        // Retrieve students with thesis status 1 and coming evaluation as Proposal
        const proposalEvaluationStudents = await students.findAll({
            where: {
                thesisstatus: 1,
                comingevaluation: 'Proposal'
            },
            attributes: ['rollno', 'name', 'batch', 'semester', 'program']
        });

        // Extract roll numbers of students
        const rollnos = proposalEvaluationStudents.map(student => student.rollno);

        // Retrieve thesis details for the selected students
        const thesisDetails = await thesis.findAll({
            where: {
                [Op.or]: [
                    { facultyid: loggedInFacultyId },
                    { internalsid: { [Op.contains]: [loggedInFacultyId] } } // Check if loggedInFacultyId is in internalsid array
                ]
            },
            attributes: ['rollno', 'thesistitle', 'facultyid', 'internalsid', 'potentialareas', 'gcapproval', 'hodapproval']
        });

        // Check if any thesis has pending approval
        const pendingThesis = thesisDetails.find(thesis =>
            thesis.gcapproval === 'Pending' || thesis.hodapproval === 'Pending'
        );

        if (pendingThesis) {
            // If any thesis has pending approval, send appropriate message
            res.json({ message: 'One or more theses have pending approval. Please wait for approval before viewing details.' });
            return;
        }

        // Find the student whose rollno matches the faculty's thesis details
        const studentThesis = proposalEvaluationStudents.find(student =>
            thesisDetails.some(thesis => thesis.rollno === student.rollno)
        );

        // Merge student and thesis details
        const result = studentThesis ? [{
            ...studentThesis.toJSON(),
            thesis: thesisDetails.find(thesis => thesis.rollno === studentThesis.rollno) || {} // Add thesis details or empty object if not found
        }] : [];

        if (result.length === 0) {
            res.json({ message: "You are not a supervisor of any thesis" });
        } else {
            res.json({ students: result });
        }

    } catch (error) {
        console.error('Error fetching students with thesis status 1 and proposal evaluation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports =
{
    getSynopsis,
    getSynopsisDetails,
    approveSynopsis,
    declineSynopsis,
    allProposalEvalations
};
