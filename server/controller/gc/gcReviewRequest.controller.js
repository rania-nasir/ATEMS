const { sequelize } = require("../../config/sequelize");
const { synopsis } = require("../../model/synopsis.model");
const { thesis } = require("../../model/thesis.model");
const { students } = require("../../model/student.model");
const { faculties } = require("../../model/faculty.model");
const { proposalevaluations } = require("../../model/proposalEvaluaton.model");
const { sendMail } = require("../../config/mailer");
const { Op, Model } = require('sequelize');


// fetch all thesis for the logged in gc
const getThesis = async (req, res) => {
    try {
        const allThesis = await thesis.findAll({
            where: {
                gcapproval: 'Pending' // only pending thesis will be fetched
            },
            attributes: ['thesisid', 'rollno', 'facultyid', 'thesistitle', 'potentialareas'],
        });

        res.json({ allThesis });

    } catch (error) {
        console.error('Error fetching thesis for review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const viewAllThesis = async (req, res) => {
    try {
        const viewallThesis = await thesis.findAll({
            attributes: ['thesisid', 'thesistitle', 'potentialareas', 'gcApproval', 'hodapproval'],
        });

        res.json({ viewallThesis });

    } catch (error) {
        console.error('Error fetching thesis for review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Function to get details of a single thesis
const getThesisDetails = async (req, res) => {
    try {
        // gc will choose an id for review
        const { thesisId } = req.params;


        const selectedThesis = await thesis.findOne({
            where: {
                thesisid: thesisId
            },
        });

        if (!selectedThesis) {
            return res.status(404).json({ error: 'thesis not found' });
        }


        const fileURL = `/uploads/${selectedThesis.proposalfilename}`; // Construct the file URL
        selectedThesis.dataValues.fileURL = fileURL; // Add the file URL to the slectedThesis object


        const facultyList = await faculties.findAll({
            attributes: ['facultyid', 'name', 'role'],
            where: {
                role: { [Op.contains]: ['Internal'] }
            }
        });



        res.json({ selectedThesis, facultyList });

    } catch (error) {
        console.error('Error fetching thesis details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to approve the fetched Thesis from above function
const approveThesis = async (req, res) => {
    try {
        // gc will choose an id for review
        const { thesisId } = req.params;
        const { final_internal1, final_internal2 } = req.body; // if GC wants to change internals, he/she can.


        const selectedThesis = await thesis.findOne({
            where: {
                thesisid: thesisId
            },
        });

        if (!selectedThesis) {
            return res.status(404).json({ error: 'thesis not found' });
        }

        const facultyList = await faculties.findAll({
            attributes: ['facultyid', 'name'],
        });

        const supervisorid = selectedThesis.facultyid;
        // fetch facultyID for selected internals by the GC
        const final_internal1id = facultyList.find(faculty => faculty.name === final_internal1)?.facultyid;
        const final_internal2id = facultyList.find(faculty => faculty.name === final_internal2)?.facultyid;

        if (!final_internal1id || !final_internal2id) {
            return res.status(400).json({ error: 'Invalid internal faculty names' });
        }

        // Validating that supervisor and internal members are not the same
        if (supervisorid === final_internal1id || supervisorid === final_internal2id || final_internal1id === final_internal2id) {
            return res.status(400).json({ error: 'Supervisor and Internals must be different for a thesis' });
        }

        // New check to ensure supervisor is not selected as an internal
        if (supervisorid === final_internal1id || supervisorid === final_internal2id) {
            return res.status(400).json({ error: 'Supervisor cannot be selected as an internal for the same thesis' });
        }

        const [rowsAffected, [updatedThesis]] = await thesis.update( // Update the thesis internals
            {
                gcapproval: 'Approved',
                internals: [final_internal1, final_internal2],
                internalsid: [final_internal1id, final_internal2id]
            },
            {
                where: {
                    thesisid: thesisId
                },
                returning: true,
            }
        );

        if (rowsAffected === 0) {
            return res.status(404).json({ error: 'Thesis not found' });
        }

        res.json({ updatedThesis });



    } catch (error) {
        console.error('Error fetching thesis details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const grantPropEvalPermission = async (req, res) => {
    try {

        const updateResult = await thesis.update(
            { gcproposalpermission: 'Granted' },
            { where: {} } // Set gcpermission to 'Granted' for all records
        );

        if (updateResult) {

            res.json({ message: "GC permission granted for all proposal evaluations" });

        } else {

            res.json({ message: "Failed to grant GC permission for proposal evaluations" });

        }

    } catch (error) {
        console.error('Error granting GC permission for proposal evaluations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const revokePropEvalPermission = async (req, res) => {
    try {

        const updateResult = await thesis.update(
            { gcproposalpermission: 'Revoke' },
            { where: {} } // Set gcpermission to 'Revoke' for all records
        );

        if (updateResult) {

            res.json({ message: "GC permission revoked for all proposal evaluations" });

        } else {

            res.json({ message: "Failed to revoke GC permission for proposal evaluations" });

        }

    } catch (error) {
        console.error('Error granting GC permission for proposal evaluations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const gcAllPendingProposals = async (req, res) => {
    try {
        const pendingProposals = await proposalevaluations.findAll({
            where: {
                gccommentsreview: 'Pending'
            }
        });

        res.json({ pendingProposals });
    } catch (error) {
        console.error('Error fetching pending proposals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}


const gcSelectedProposalDetails = async (req, res) => {

    try {
        const { rollno } = req.params;

        const selectedProposal = await proposalevaluations.findOne({
            where: {
                rollno
            }
        });

        if (selectedProposal) {
            res.json({ selectedProposal });
        } else {
            res.status(404).json({ error: 'Proposal not found' });
        }
    } catch (error) {
        console.error('Error fetching proposal details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}


const gcApproveProposal = async (req, res) => {
    try {
        const { rollno } = req.params;

        // Update the proposal evaluation
        const [updatedRows, [updatedProposal]] = await proposalevaluations.update(
            { gccommentsreview: 'Approved' },
            { where: { rollno }, returning: true }
        );

        if (updatedRows === 1) {
            // Update the comingevaluation status in the students model
            const updatedStudent = await students.update(
                { comingevaluation: 'Mid1' },
                // { where: { rollno, gccommentsreview: 'Approved' } }
                { where: { rollno } }
            );

            if (updatedStudent[0] === 1) {
                // Get student details
                const student = await students.findOne({ where: { rollno } });

                if (student) {
                    // Send approval email to student
                    const subject = 'Proposal Approval';
                    const text = 'Your proposal has been approved. Congratulations!';
                    await sendMail(student.email, subject, text);

                    res.json({ message: 'Proposal approved, comingevaluation status updated, and email sent to student' });
                }
                else {

                    res.status(404).json({ error: 'Student not found' });
                }

            } else {

                res.status(404).json({ error: 'Student not found or proposal not approved' });
            }

        } else {

            res.status(404).json({ error: 'Proposal not found or not approved' });
        }

    } catch (error) {

        console.error('Error approving proposal:', error);
        res.status(500).json({ error: 'Internal server error' });

    }

};



const gcRejectProposal = async (req, res) => {
    try {
        const { rollno } = req.params;

        // Update the proposal evaluation to 'Rejected'
        const [updatedRows, [updatedProposal]] = await proposalevaluations.update(
            {
                gccommentsreview: 'Rejected',
            },
            { where: { rollno }, returning: true }

        );

        if (updatedRows === 1) {
            // Update the comingevaluation status in the students model
            const updatedStudent = await students.update(
                {
                    comingevaluation: 'Proposal',
                    reevaluationstatus: true
                },
                { where: { rollno } }
            );

            if (updatedStudent[0] === 1) {
                // Get student details
                const student = await students.findOne({ where: { rollno } });

                if (student) {
                    // Send rejection email to student
                    const subject = 'Proposal Rejection';
                    const text = 'Your proposal has been rejected.';
                    await sendMail(student.email, subject, text);

                    res.json({ message: 'Proposal rejected, comingevaluation status updated, and email sent to student' });
                }
                else {

                    res.status(404).json({ error: 'Student not found' });
                }

            } else {

                res.status(404).json({ error: 'Student not found or proposal not rejected' });
            }

        } else {

            res.status(404).json({ error: 'Proposal not found or not rejected' });
        }

    } catch (error) {

        console.error('Error rejecting proposal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports =
{
    getThesis,
    getThesisDetails,
    approveThesis,
    viewAllThesis,
    grantPropEvalPermission,
    revokePropEvalPermission,
    gcAllPendingProposals,
    gcSelectedProposalDetails,
    gcApproveProposal,
    gcRejectProposal
};
