const { sequelize } = require("../../config/sequelize");
const { synopsis } = require("../../model/synopsis.model");
const { thesis } = require("../../model/thesis.model");
const { students } = require("../../model/student.model");
const { faculties } = require("../../model/faculty.model");
const { feedbacks } = require("../../model/feedback.model");
const { proposalevaluations } = require("../../model/proposalEvaluaton.model");
const { sendMail } = require("../../config/mailer");
const { Op, Model } = require('sequelize');
const { midevaluations } = require("../../model/midEvaluation.model");


// fetch all thesis for the logged in gc
const getThesis = async (req, res) => {
    try {
        const allThesis = await thesis.findAll({
            where: {
                gcapproval: 'Pending' // only pending thesis will be fetched
            },
            attributes: ['thesisid', 'rollno', 'facultyid', 'supervisorname', 'thesistitle', 'potentialareas'],
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
            attributes: ['thesisid', 'thesistitle', 'potentialareas', 'gcapproval', 'hodapproval'],
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
                role: { [Op.contains]: ['Internal'] },
                name: { [Op.not]: selectedThesis.supervisorname } // Exclude the supervisor's name
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
        const { final_internal1, internal1researcharea, final_internal2, internal2researcharea } = req.body; // if GC wants to change internals, he/she can.


        const selectedThesis = await thesis.findOne({
            where: {
                thesisid: thesisId
            },
        });

        if (!selectedThesis) {
            return res.status(404).json({ error: 'thesis not found' });
        }

        const facultyList = await faculties.findAll({
            attributes: ['facultyid', 'name', 'email'],
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
                internalsid: [final_internal1id, final_internal2id],
                researcharea: [internal1researcharea, internal2researcharea]
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

        // Send email to selected internal examiners
        const internalsEmails = [
            facultyList.find(faculty => faculty.facultyid === final_internal1id)?.email,
            facultyList.find(faculty => faculty.facultyid === final_internal2id)?.email
        ];

        const subject = 'Internal examiner';
        const text = `You have been selected as an internal examiner for the following thesis:
            Thesis ID: ${thesisId}
            Title: ${selectedThesis.thesistitle}
            Supervisor: ${selectedThesis.supervisorname}`;
        const html = `<p>You have been selected as an internal examiner for the following thesis:</p>
            <ul>
                <li><strong>Thesis ID:</strong> ${thesisId}</li>
                <li><strong>Title:</strong> ${selectedThesis.thesistitle}</li>
                <li><strong>Supervisor:</strong> ${selectedThesis.supervisorname}</li>
            </ul>`;
        sendMail(internalsEmails, subject, text, html);


        res.json({ updatedThesis });



    } catch (error) {
        console.error('Error fetching thesis details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const grantPropEvalPermission = async (req, res) => {
    try {
        const allApproved = await thesis.findOne({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('thesisid')), 'total'],
                [sequelize.fn('COUNT', sequelize.literal("CASE WHEN hodapproval = 'Approved' THEN 1 END")), 'hodCount'],
                [sequelize.fn('COUNT', sequelize.literal("CASE WHEN gcapproval = 'Approved' THEN 1 END")), 'gcCount']
            ]
        });

        // Log the raw data received from the query to debug
        console.log('All Approved Theses:', allApproved.toJSON());

        // Retrieve the counts from the raw data
        const totalTheses = allApproved.get('total');
        const hodApprovedCount = allApproved.get('hodCount');
        const gcApprovedCount = allApproved.get('gcCount');

        // console.log('Total theses:', totalTheses);
        // console.log('Approved HOD count:', hodApprovedCount);
        // console.log('Approved GC count:', gcApprovedCount);

        if (totalTheses > 0 && totalTheses === hodApprovedCount && totalTheses === gcApprovedCount) {
            const updateResult = await thesis.update(
                { gcproposalpermission: 'Granted' },
                { where: {} } // Set gcpermission to 'Granted' for all records
            );

            if (updateResult) {
                res.json({ message: "GC permission granted for all proposal evaluations" });
            } else {
                res.json({ message: "Failed to grant GC permission for proposal evaluations" });
            }
        } else {
            res.json({ message: "Not all theses have approved HOD and GC permissions" });
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
                gcProposalCommentsReview: 'Pending'
            },
            attributes: [
                [sequelize.literal('DISTINCT "rollno"'), 'rollno'],
                'stdname',
                'batch',
                'semester'
            ]
        });

        res.json({ pendingProposals });
    } catch (error) {
        console.error('Error fetching pending proposals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const gcSelectedProposalDetails = async (req, res) => {

    try {
        const { rollno } = req.params;

        const selectedProposal = await proposalevaluations.findAll({
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

        // Update all proposal evaluations for the given rollno
        const [updatedRows] = await proposalevaluations.update(
            { gcProposalCommentsReview: 'Approved' },
            { where: { rollno } }
        );

        if (updatedRows > 0) {

            // Find the approved proposal evaluations for the given rollno
            const approvedProposals = await proposalevaluations.findAll({
                where: {
                    rollno,
                    gcProposalCommentsReview: 'Approved'
                }
            });

            if (approvedProposals.length > 0) {
                // Iterate through each approved proposal
                for (const proposal of approvedProposals) {
                    // Extract comments from the approved proposal
                    const comments = proposal.comments;

                    // Create a feedback record for the approved proposal
                    await feedbacks.create({
                        rollno,
                        facultyid: proposal.facultyid,
                        facultyname: proposal.facname,
                        feedbackContent: comments,
                        feedbackType: 'Proposal',
                    });
                }



                // Update the comingevaluation status in the students model
                const [updatedStudentCount] = await students.update(
                    {
                        comingevaluation: 'Mid1',
                        reevaluationstatus: 'false'
                    },
                    { where: { rollno } }
                );

                if (updatedStudentCount > 0) {
                    // Get student details
                    const student = await students.findOne({ where: { rollno } });

                    if (student) {
                        // Send approval email to student
                        const subject = 'Proposal Approval';
                        const text = 'Your proposal has been approved. Congratulations!';
                        await sendMail(student.email, subject, text);

                        res.json({ message: 'Proposal approved, comingevaluation status updated, and email sent to student' });
                    } else {
                        res.status(404).json({ error: 'Student not found' });
                    }
                } else {
                    res.status(404).json({ error: 'Proposal not approved or student not found' });
                }
            } else {
                res.status(404).json({ error: 'No proposal found or not approved' });
            }
        } else {
            res.status(404).json({ error: 'No approved proposal found for the student' });
        }
    } catch (error) {
        console.error('Error approving proposal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};







const gcRejectProposal = async (req, res) => {
    try {
        const { rollno } = req.params;

        // Update all proposal evaluations for the given rollno to 'Rejected'
        const [updatedRows] = await proposalevaluations.update(
            { gcProposalCommentsReview: 'Rejected' },
            { where: { rollno } }
        );

        if (updatedRows > 0) {
            // Update the comingevaluation status in the students model
            const [updatedStudentCount] = await students.update(
                {
                    comingevaluation: 'Proposal',
                    reevaluationstatus: true
                },
                { where: { rollno } }
            );

            if (updatedStudentCount > 0) {
                // Get student details
                const student = await students.findOne({ where: { rollno } });

                if (student) {
                    // Send rejection email to student
                    const subject = 'Proposal Rejection';
                    const text = 'Your proposal has been rejected.';
                    await sendMail(student.email, subject, text);

                    res.json({ message: 'Proposal rejected, comingevaluation status updated, and email sent to student' });
                } else {
                    res.status(404).json({ error: 'Student not found' });
                }
            } else {
                res.status(404).json({ error: 'Proposal not rejected or student not found' });
            }
        } else {
            res.status(404).json({ error: 'No proposal found or not rejected' });
        }
    } catch (error) {
        console.error('Error rejecting proposal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const grantMidEvalPermission = async (req, res) => {
    try {
        const facultyId = req.userId;
        // Check if the faculty has the GC role
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["GC"]
                },
            }
        });

        if (!faculty) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }

        // Update all records in proposalevaluations to set midEvaluationPermission to true
        await proposalevaluations.update(
            { midEvaluationPermission: true },
            { where: {} } // No specific where clause needed, as we're updating all records
        );

        return res.json({ message: 'Mid-evaluation permissions successfully updated for all proposal evaluations.' });

    } catch (error) {
        console.error('Error setting mid-evaluation permissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const revokeMidEvalPermission = async (req, res) => {
    try {
        const facultyId = req.userId;
        // Check if the faculty has the GC role
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["GC"]
                },
            }
        });

        if (!faculty) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }

        // Update all records in proposalevaluations to set midEvaluationPermission to true
        await proposalevaluations.update(
            { midEvaluationPermission: false },
            { where: {} } // No specific where clause needed, as we're updating all records
        );

        return res.json({ message: 'Mid-evaluation permissions successfully updated for all proposal evaluations.' });

    } catch (error) {
        console.error('Error setting mid-evaluation permissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const gcAllPendingMidEvaluations = async (req, res) => {
    try {
        const facultyId = req.userId;
        // Check if the faculty has the GC role
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["GC"]
                },
            }
        });

        if (!faculty) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }
        const pendingMidReviews = await midevaluations.findAll({
            where: {
                gcMidCommentsReview: 'Pending'
            },
            attributes: [
                [sequelize.literal('DISTINCT "rollno"'), 'rollno'],
                'stdname',
                'batch',
                'semester'
            ]
        });

        res.json({ pendingMidReviews });
    } catch (error) {
        console.error('Error fetching pending mid evaluations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const gcSelectedMidEvaluationDetails = async (req, res) => {

    try {
        const facultyId = req.userId;
        // Check if the faculty has the GC role
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["GC"]
                },
            }
        });

        if (!faculty) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }
        const { rollno } = req.params;

        const selectedMidEvaluation = await midevaluations.findAll({
            where: {
                rollno
            }
        });

        if (selectedMidEvaluation) {
            res.json({ selectedMidEvaluation });
        } else {
            res.status(404).json({ error: 'Mid Evaluation not found' });
        }
    } catch (error) {
        console.error('Error fetching mid evaluation details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const gcApproveMidEvaluation = async (req, res) => {
    try {
        const facultyId = req.userId;
        // Check if the faculty has the GC role
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["GC"]
                },
            }
        });

        if (!faculty) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }

        const { rollno } = req.params;

        // Update all proposal evaluations for the given rollno
        const [updatedRows] = await midevaluations.update(
            { gcMidCommentsReview: 'Approved' },
            { where: { rollno } }
        );

        if (updatedRows > 0) {

            // Find the approved proposal evaluations for the given rollno
            const approvedMidEvaluation = await midevaluations.findAll({
                where: {
                    rollno,
                    gcMidCommentsReview: 'Approved'
                }
            });

            if (approvedMidEvaluation.length > 0) {
                // Iterate through each approved proposal
                for (const midEvaluation of approvedMidEvaluation) {
                    // Extract comments from the approved proposal
                    const comments = midEvaluation.comments;

                    // Create a feedback record for the approved proposal
                    await feedbacks.create({
                        rollno,
                        facultyid: midEvaluation.facultyid,
                        facultyname: midEvaluation.facname,
                        feedbackContent: comments,
                        feedbackType: 'Mid1',
                    });
                }



                // Update the comingevaluation status in the students model
                const [updatedStudentCount] = await students.update(
                    {
                        comingevaluation: 'Final1',
                        reevaluationstatus: 'false'
                    },
                    { where: { rollno } }
                );

                if (updatedStudentCount > 0) {
                    // Get student details
                    const student = await students.findOne({ where: { rollno } });

                    if (student) {
                        // Send approval email to student
                        const subject = 'Mid Evaluation Approval';
                        const text = 'Your Mid Evaluation has been approved, You can now view the feedback';
                        await sendMail(student.email, subject, text);

                        res.json({ message: 'Mid Evaluation approved, comingevaluation status updated, and email sent to student' });
                    } else {
                        res.status(404).json({ error: 'Student not found' });
                    }
                } else {
                    res.status(404).json({ error: 'mid evaluation not approved or student not found' });
                }
            } else {
                res.status(404).json({ error: 'No mid evaluation found or not approved' });
            }
        } else {
            res.status(404).json({ error: 'No mid evaluation found for the student' });
        }
    } catch (error) {
        console.error('Error approving mid evaluation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



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
    gcRejectProposal,
    grantMidEvalPermission,
    revokeMidEvalPermission,
    gcAllPendingMidEvaluations,
    gcSelectedMidEvaluationDetails,
    gcApproveMidEvaluation
};
