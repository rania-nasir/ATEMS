const { sequelize } = require("../../config/sequelize");
const { synopsis } = require("../../model/synopsis.model");
const { thesis } = require("../../model/thesis.model");
const { faculties } = require("../../model/faculty.model");
const { students } = require("../../model/student.model");
const { sendMail } = require("../../config/mailer");


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
            attributes: ['synopsisid', 'synopsistitle', 'description'],
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
            attributes: ['facultyid', 'name'],
        });

        if (!selectedSynopsis) {
            return res.status(404).json({ error: 'Synopsis not found' });
        }

        res.json({ selectedSynopsis, facultyList });

    } catch (error) {
        console.error('Error fetching synopsis details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const approveSynopsis = async (req, res) => {
    try {
        const { synopsisId } = req.params;
        const facultyId = req.userId;
        const { internal1, internal2 } = req.body;

        console.log('Internals are : ', internal1, ', ', internal2)

        const existingApprovedSynopsis = await synopsis.findOne({
            where: {
                synopsisid: synopsisId,
                synopsisstatus: 'Approved'
            }
        });

        if (existingApprovedSynopsis) {
            return res.status(400).json({ error: 'A request with the same synopsis ID already exists' });
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

        const facultyList = await faculties.findAll({
            attributes: ['facultyid', 'name'],
        });

        console.log('Faculty List:', facultyList);

        const internal1id = facultyList.find(faculty => faculty.name === internal1)?.facultyid;
        const internal2id = facultyList.find(faculty => faculty.name === internal2)?.facultyid;

        if (!internal1id || !internal2id) {
            return res.status(400).json({ error: 'Invalid internal faculty names' });
        }

        // Validating that supervisor and internal members are not the same
        if (facultyId === internal1id || facultyId === internal2id || internal1id === internal2id) {
            return res.status(400).json({ error: 'Supervisor and Internals must be different for a thesis' });
        }

        const [rowsAffected, [updatedSynopsis]] = await synopsis.update(
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


        const newThesis = await thesis.create({
            thesistitle: selectedSynopsis.synopsistitle,
            description: selectedSynopsis.description,
            rollno: selectedSynopsis.rollno,
            facultyid: selectedSynopsis.facultyid,
            internals: [internal1, internal2],
            internalsid: [internal1id, internal2id],
            thesisstatus: 'Pending'
        });



        res.json({ message: 'Internal members selected successfully and Synopsis approved', thesis: newThesis });

    } catch (error) {
        console.error('Error approving synopsis or selecting internal members:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const declineSynopsis = async (req, res) => {
    try {
        const { synopsisId } = req.params;
        const facultyId = req.userId;

        const student = await synopsis.findOne({
            where: {
                synopsisid: synopsisId
            },
            attributes: ['rollno'],
            include: [
                {
                    model: students,
                    as: 'students',
                    attributes: ['rollno', 'email', 'name']
                }
            ]
        });

        if (!student || !student.students) {
            return res.status(404).json({ error: 'Student not found for the given synopsis' });
        }

        const studentEmail = student.students[0].email;
        if (!studentEmail || !/^.+@.+\..+$/.test(studentEmail)) {
            return res.status(400).json({ error: 'Invalid student email address' });
        }
        console.log(studentEmail);

        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId
            },
            attributes: ['name']
        });

        if (!faculty) {
            return res.status(404).json({ error: 'Faculty not found for the given ID' });
        }

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


module.exports =
{
    getSynopsis,
    getSynopsisDetails,
    approveSynopsis,
    declineSynopsis
};
