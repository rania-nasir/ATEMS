const { sequelize } = require("../../../config/sequelize");
const { faculties } = require("../../../model/faculty.model");
const { students } = require("../../../model/student.model");
const { sendMail } = require("../../../config/mailer");
const { twomidevaluations } = require("../../../model/thesistwo/thesisTwoMidEval.model");
const { twofinalevaluations } = require("../../../model/thesistwo/thesisTwoFinalEval.model");
const { registrations } = require("../../../model/thesistwo/registration.model");
const { Op } = require('sequelize');


const getThesisTwoRegRequests = async (req, res) => {
    try {
        const pendingRequests = await registrations.findAll({
            where: {
                gcapproval: 'Pending',
                supervisorapproval: 'Approved'
            },
            attributes: ['rollno', 'stdname', 'thesistitle', 'supervisorname', 'internals']
        });

        res.json({ pendingRequests });

    } catch (error) {
        console.error('Error getting thesis two registration requests:', error);
        res.status(500).json({ message: 'An error occurred while fetching the requests' });
    }
};

const getThesisTwoRegRequestDetails = async (req, res) => {
    try {
        const { rollno } = req.params;

        const studentDetails = await registrations.findOne({
            where: {
                rollno: rollno,
                supervisorapproval: 'Approved'
            }
        });

        if (!studentDetails) {
            return res.status(404).json({ message: 'No approved request found for this student' });
        }

        res.json({ studentDetails });
    } catch (error) {
        console.error('Error getting thesis two registration request details:', error);
        res.status(500).json({ message: 'An error occurred while fetching the request details' });
    }
};


const approveThesisTwoRegRequest = async (req, res) => {
    try {
        const { rollno } = req.params;

        const studentRegistration = await registrations.findOne({
            where: {
                rollno: rollno,
                supervisorapproval: 'Approved',
                gcapproval: 'Pending'
            }
        });

        if (!studentRegistration) {
            return res.json({ message: 'No pending request found for this student' });
        }


        await studentRegistration.update({
            gcapproval: 'Approved'
        });

        res.json({ message: 'Request approved successfully' });

    } catch (error) {
        console.error('Error approving thesis two registration request:', error);
        res.status(500).json({ message: 'An error occurred while approving the request' });
    }

};



const grantMidEvalPermission = async (req, res) => {
    try {
        const records = await registrations.findAll(); // Fetch all records from the registrations table

        let allRecordsApproved = true; // Flag to track if all records have the required approvals
        let allRecordsHaveThesisTwoReport = true; // Flag to track if all records have uploaded the thesis two report file

        for (const record of records) {
            if (record.supervisorapproval !== 'Approved' || record.gcapproval !== 'Approved' || record.hodapproval !== 'Approved') {
                allRecordsApproved = false;
                break; // Exit the loop as soon as we find a record with pending approval
            }

            if (!record.thesistwofilename || record.thesistwofilename === '') {
                allRecordsHaveThesisTwoReport = false;
                break; // Exit the loop as soon as we find a record without a thesis two report file
            }
        }

        if (allRecordsApproved && allRecordsHaveThesisTwoReport) {
            await registrations.update(
                { gcmidevalpermission: true },
                { where: {} } // Update all records
            );

            res.json({ message: 'Mid 2 evaluation permission granted for all records' });

        } else if (!allRecordsApproved) {
            res.json({ message: 'Some registrations are pending for relevant approvals' });

        } else if (!allRecordsHaveThesisTwoReport) {
            res.json({ message: 'Some students have not uploaded their thesis two report file yet. Permission cannot be granted.' });

        } else {
            res.json({ message: 'Some registrations are pending for relevant approvals and/or thesis two report file upload.' });
        }

    } catch (error) {
        console.error('Error granting mid 2 evaluation permission:', error);
        res.status(500).json({ message: 'An error occurred while granting mid-evaluation permission' });
    }
};



const revokeMidEvalPermission = async (req, res) => {
    try {
        await registrations.update({
            gcmidevalpermission: false
        }, {
            where: {}
        });

        res.json({ message: 'Mid 2 Evaluation permission revoked for all records' });

    } catch (error) {

        console.error('Error revoking mid 2 evaluation permission:', error);
        res.status(500).json({ message: 'An error occurred while revoking mid-evaluation permission' });
    }
}



const getGCMidPermissionStatus = async (req, res) => {
    try {
        const record = await registrations.findOne();

        if (record) {
            res.json({ gcmidevalpermission: record.gcmidevalpermission });

        } else {
            res.json({ message: 'No records found' });
        }

    } catch (error) {

        console.error('Error getting mid-evaluation permission status:', error);
        res.status(500).json({ message: 'An error occurred while getting the permission status' });
    }
}


// const getAllMid2Evaluations = async (req, res) => {
//     try {
//         const facultyId = req.userId;
//         const faculty = await faculties.findOne({
//             where: {
//                 facultyid: facultyId,
//                 role: {
//                     [Op.contains]: ["GC"]
//                 },
//             }
//         });

//         if (!faculty) {
//             return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
//         }

//         // Query to retrieve the value of gcmidevalpermission from thesis table
//         const gcMidEvalPermission = await registrations.findOne({
//             attributes: ['gcmidevalpermission'],
//             limit: 1
//         });

//         // Check if a record was found
//         if (gcMidEvalPermission) {
//             const permissionValue = gcMidEvalPermission.gcmidevalpermission;

//             if (permissionValue === false) {
//                 // Query to find all pending proposals
//                 const pendingMid2Evaluations = await twomidevaluations.findAll({
//                     where: {
//                         gcapproval: 'Pending'
//                     },
//                     attributes: [
//                         [sequelize.literal('DISTINCT "rollno"'), 'rollno'],
//                         'stdname',
//                         'thesistitle'
//                     ]
//                 });

//                 // Check if all pending proposals have been evaluated by Supervisor and Internals
//                 const allMid2Evaluated = await Promise.all(pendingMid2Evaluations.map(async (mid2Eval) => {
//                     const { rollno } = mid2Eval;

//                     // Query to find thesis record by rollno
//                     const mid2Reocrd = await registrations.findOne({ where: { rollno } });
//                     if (!mid2Reocrd) return false;

//                     const { internals, supervisorname } = mid2Reocrd;

//                     // Check if each internal has provided feedback for the proposal
//                     const internalFeedbacks = await twomidevaluations.findAll({
//                         where: {
//                             rollno,
//                             facultyname: internals,
//                             gcapproval: 'Pending'
//                         }
//                     });
//                     const internsEvaluated = internals.every(internal => {
//                         return internalFeedbacks.some(feedback => feedback.facultyname === internal);
//                     });

//                     // Check if supervisor has provided feedback for the proposal
//                     const supervisorFeedback = await twomidevaluations.findOne({
//                         where: {
//                             rollno,
//                             facultyname: supervisorname,
//                             gcapproval: 'Pending'
//                         }
//                     });
//                     const supervisorEvaluated = supervisorFeedback !== null;

//                     return supervisorEvaluated && internsEvaluated;
//                 }));

//                 // If all mid evals are evaluated, send response
//                 if (allMid2Evaluated.every(evaluated => evaluated)) {
//                     res.json({ pendingMid2Evaluations });
//                 } else {
//                     res.json({ message: "Not all pending mids have been evaluated by Supervisor and Internals" });
//                 }
//             } else {
//                 res.json({ message: "Mid Evaluations are being evaluated. Revoke the permssion to complete the action" });
//             }
//         } else {
//             res.status(404).json({ message: "No Mid record found" });
//         }
//     } catch (error) {
//         console.error('Error fetching pending mid 2 evaluation:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }


const getAllMid2Evaluations = async (req, res) => {
    try {
        const facultyId = req.userId;
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

        // Query to retrieve the value of gcmidevalpermission from thesis table
        const gcMidEvalPermission = await registrations.findOne({
            attributes: ['gcmidevalpermission'],
            limit: 1
        });

        // Check if a record was found
        if (gcMidEvalPermission) {
            const permissionValue = gcMidEvalPermission.gcmidevalpermission;

            if (permissionValue === false) {
                // Query to find all pending proposals
                const pendingMid2Evaluations = await twomidevaluations.findAll({
                    where: {
                        gcapproval: 'Pending'
                    },
                    attributes: [
                        [sequelize.literal('DISTINCT "rollno"'), 'rollno'],
                        'stdname',
                        'thesistitle'
                    ]
                });

                res.json({ pendingMid2Evaluations });
            } else {
                res.json({ message: "Mid Evaluations are being evaluated. Revoke the permission to complete the action" });
            }
        } else {
            res.status(404).json({ message: "No Mid record found" });
        }
    } catch (error) {
        console.error('Error fetching pending mid 2 evaluation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}




const getSelectedMid2EvaluationDetails = async (req, res) => {
    try {
        const { rollno } = req.params;

        const selectedMidEvaluation = await twomidevaluations.findAll({
            where: {
                rollno
            }
        });

        if (selectedMidEvaluation) {
            res.json({ selectedMidEvaluation });
        } else {
            res.json({ message: 'Mid Evaluation not found' });
        }
    } catch (error) {
        console.error('Error fetching mid evaluation details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}




const approveMid2Evaluation = async (req, res) => {
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
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        const { rollno } = req.params;
        const { gcapproval } = req.body;

        if (!gcapproval) {
            return res.json({ message: 'Mid approval is required from your side' });
        }

        await twomidevaluations.update(
            { gcapproval },
            { where: { rollno } }
        );

        // Get student email
        const student = await students.findOne({ where: { rollno } });
        const studentEmail = student ? student.email : '';

        // Email notification logic based on gcapproval status
        let emailSubject = '';
        let emailText = '';

        switch (gcapproval) {
            case 'Ready':
                emailSubject = 'Mid Evaluation Passed';
                emailText = 'Your Mid Evaluation has been approved. You will be informed about external evaluations soon.';
                // Update relevant student record in students model
                await students.update(
                    { comingevaluation: 'Final2' },
                    { where: { rollno } }
                );
                break;
            case 'CN':
                emailSubject = 'Continuation Required';
                emailText = 'You need to continue further for one more semester to improve your thesis work.';
                break;
            case 'F':
                emailSubject = 'Mid Evaluation Failed';
                emailText = 'Unfortunately, your Mid Evaluation has been failed. You need to re-register for Thesis 2.';
                break;
            default:
                break;
        }

        // Send email to student
        await sendMail(studentEmail, emailSubject, emailText);

        // Create feedback if comments are provided
        if (req.body.comments) {
            await feedbacks.create({
                rollno,
                facultyid: facultyId,
                facultyname: faculty.name,
                feedbackContent: req.body.comments,
                feedbackType: 'Thesis-2 Mid',
            });
        }

        if (gcapproval === 'CN' || gcapproval === 'F') {
            await twomidevaluations.destroy({ where: { rollno } });
            await registrations.destroy({ where: { rollno } });
        }

        res.json({ message: `Mid Evaluation status updated to ${gcapproval} and email sent to student` });

    } catch (error) {
        console.error('Error approving Mid 2 evaluation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

const getAllApprovedThesis = async (req, res) => {
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
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        const allApprovedThesis = await twomidevaluations.findAll({
            where: {
                gcapproval: 'Ready',
            },
        });

        if (!allApprovedThesis) {
            return res.json({ message: 'No Ready Thesis found' });
        }

        res.json(allApprovedThesis);


    } catch (error) {
        console.error('Error getting all approved thesis :', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Assigning random password
// Helper function to generate passwords
function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*_'; // creating random password from these characters
    let password = '';
    for (let i = 0; i < length; i++) { // randomizing the characters
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}

const assignExternalToThesis = async (req, res) => {
    try {
        const facultyId = req.userId;
        const { name, email, gender, mobile } = req.body;

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
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        // Find the highest numeric facultyid
        const lastFaculty = await faculties.findOne({
            order: [[sequelize.cast(sequelize.col('facultyid'), 'BIGINT'), 'DESC']]
        });

        let nextFacultyId;
        if (lastFaculty) {
            nextFacultyId = String(Number(lastFaculty.facultyid) + 1);
        } else {
            nextFacultyId = '1';
        }

        const autoGeneratedPassword = generateRandomPassword(8);
        const newExternal = await faculties.create({
            facultyid: nextFacultyId,
            name: name,
            email: email,
            gender: gender,
            role: ['External'],
            mobile: mobile,
            password: autoGeneratedPassword,
        });

        if (!newExternal) {
            return res.json({ error: 'Failed to add external ' });
        }

        res.json(newExternal);

    } catch (error) {
        console.error('Error getting all approved thesis :', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const grantFinalEvalPermission = async (req, res) => {
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
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        // Check if midPermission is false
        const gcFinalPermission = await twomidevaluations.findOne({
            attributes: ['gcfinalevalpermission'],
            limit: 1
        });

        if (!gcFinalPermission || gcFinalPermission.gcfinalevalpermission !== false) {
            return res.json({ message: 'Mid Evaluations permission is not revoked' });
        }

        // Check if all gcMidCommentsReview in proposalEvaluations table are 'Approved'
        const allApproved = await twomidevaluations.findAll({
            where: {
                gcMidCommentsReview: {
                    [Op.ne]: 'Approved'
                }
            }
        });

        if (allApproved.length > 0) {
            return res.json({ message: 'All mid evaluations are not completely evaluated yet.' });
        }

        // Update finalEvaluationPermission for all records
        await twomidevaluations.update(
            { gcfinalevalpermission: true },
            { where: {} }
        );

        return res.json({ message: 'Final-evaluation permissions successfully granted.' });

    } catch (error) {
        console.error('Error granting final 2 permission:', error);
        res.status(500).json({ message: 'An error occurred while granting final-evaluation permission' });
    }
};

const revokeFinalEvalPermission = async (req, res) => {
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
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        // Update all records in midevaluations to set finalEvaluationPermission to false
        await twomidevaluations.update(
            { gcfinalevalpermission: false },
            { where: {} } // No specific where clause needed, as we're updating all records
        );

        return res.json({ message: 'Final-evaluation permissions revoked for all record.' });

    } catch (error) {
        console.error('Error setting Final-evaluation permissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getGCFinalPermissionStatus = async (req, res) => {
    try {
        // Query to retrieve the value of finalEvaluationPermission from midevaluations table
        const finalEvaluation = await twomidevaluations.findOne({
            attributes: ['gcfinalevalpermission'],
            limit: 1 // Limit to one result as we only need one value
        });

        // Check if a record was found
        if (finalEvaluation) {
            const finalEvaluationValue = finalEvaluation.gcfinalevalpermission;
            res.json({ gcfinalevalpermission: finalEvaluationValue });
        } else {
            res.json({ message: "No Final Evaluation record found" });
        }
    } catch (error) {
        console.error('Error retrieving Final Evaluation permission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllFinal2Evaluations = async (req, res) => {
    try {
        const facultyId = req.userId;
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["GC"]
                },
            }
        });

        if (!faculty) {
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        // Fetch finalEvaluationPermission
        const finalEvaluation = await twomidevaluations.findOne({
            attributes: ['gcfinalevalpermission'],
            limit: 1 // Limit to one result as we only need one value
        });

        // Check if a record was found
        if (!finalEvaluation) {
            return res.json({ message: 'Final evaluation permission record not found' });
        }

        // Check if finalEvaluationPermission is true (indicating it's not closed yet)
        if (finalEvaluation.gcfinalevalpermission === true) {
            return res.json({ message: 'Final evaluations are not closed yet' });
        }

        // Find all pending final evaluations
        const pendingFinalReviews = await twofinalevaluations.findAll({
            where: {
                gcFinalCommentsReview: 'Pending'
            },
            attributes: [
                [sequelize.literal('DISTINCT "rollno"'), 'rollno'],
                'stdname',
                'rollno',
                'thesistitle',
            ]
        });

        res.json({ pendingFinalReviews });

    } catch (error) {
        console.error('Error fetching pending final evaluations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getSelectedFinal2EvaluationDetails = async (req, res) => {

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
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }
        const { rollno } = req.params;

        const selectedFinalEvaluation = await twofinalevaluations.findAll({
            where: {
                rollno
            }
        });

        if (selectedFinalEvaluation) {
            res.json({ selectedFinalEvaluation });
        } else {
            res.status(404).json({ error: 'Final Evaluation not found' });
        }
    } catch (error) {
        console.error('Error fetching Final evaluation details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const approveFinal2Evaluation = async (req, res) => {
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
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        const { rollno } = req.params;
        const { thesistwograde } = req.body;

        // Update all final evaluations for the given rollno
        // const [updatedRows] = await finalevaluations.update(
        //     {
        //         gcFinalCommentsReview: 'Approved',
        //         thesisonegrade
        //     },

        //     { where: { rollno } }
        // );


        if (!thesistwograde) {
            return res.json({ message: 'Thesis grade is required' });
        }

        let gcFinalCommentsReview = '';
        let mailText = '';

        if (thesistwograde === 'A') {
            gcFinalCommentsReview = 'Approved';
            mailText = 'Your Final Evaluation has been approved, You can now view the feedback, Grade will be updated on FLEX.';
        } else if (thesistwograde === 'F') {
            gcFinalCommentsReview = 'Rejected';
            mailText = 'Your Final Evaluation has been rejected with an F grade.';

        }

        const [updatedRows] = await twofinalevaluations.update(
            { gcFinalCommentsReview, thesistwograde },
            { where: { rollno } }
        );

        if (updatedRows > 0) {

            // Find the approved final evaluations for the given rollno
            const approvedFinalEvaluation = await twofinalevaluations.findAll({
                where: {
                    rollno,
                    gcFinalCommentsReview
                }
            });

            if (approvedFinalEvaluation.length > 0) {
                // Iterate through each approved final evaluation
                for (const finalEvaluation of approvedFinalEvaluation) {
                    // Extract comments from the approved final evaluation
                    const comments = finalEvaluation.comments;

                    // Create a feedback record for the approved final evaluation
                    await feedbacks.create({
                        rollno,
                        facultyid: finalEvaluation.facultyid,
                        facultyname: finalEvaluation.facname,
                        feedbackContent: comments,
                        feedbackType: 'Final2',
                    });
                }



                // Update the comingevaluation status in the students model
                const [updatedStudentCount] = await students.update(
                    {
                        comingevaluation: thesistwograde === 'A' ? 'Mid2' : 'Proposal',
                        thesisstatus: thesistwograde === 'A' ? 2 : 1,
                        reevaluationstatus: 'false'
                    },
                    { where: { rollno } }
                );

                if (updatedStudentCount > 0) {
                    // Get student details
                    const student = await students.findOne({ where: { rollno } });

                    if (student) {
                        // Send approval email to student
                        const subject = 'Final Evaluation 2';
                        // const text = 'Your Final Evaluation has been approved, You can now view the feedback, Grade will be updated on FLEX';
                        await sendMail(student.email, subject, mailText);

                        if (thesistwograde === 'F') {
                            // Delete records from related models only if the grade is F
                            await registrations.destroy({ where: { rollno } });
                            await twomidevaluations.destroy({ where: { rollno } });
                            await twofinalevaluations.destroy({ where: { rollno } });
                        }

                        res.json({ message: 'Final Evaluation updated, and email sent to student' });
                    } else {
                        res.json({ message: 'Student not found' });
                    }
                } else {
                    res.json({ message: 'Final evaluation not approved or student not found' });
                }
            } else {
                res.json({ message: 'No Final evaluation found or not approved' });
            }
        } else {
            res.json({ message: 'No Final evaluation found for the student' });
        }
    } catch (error) {
        console.error('Error approving Final evaluation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports =
{
    getThesisTwoRegRequests,
    getThesisTwoRegRequestDetails,
    approveThesisTwoRegRequest,
    grantMidEvalPermission,
    revokeMidEvalPermission,
    getGCMidPermissionStatus,
    getAllMid2Evaluations,
    getSelectedMid2EvaluationDetails,
    approveMid2Evaluation,
    getAllApprovedThesis,
    assignExternalToThesis,
    grantFinalEvalPermission,
    revokeFinalEvalPermission,
    getGCFinalPermissionStatus,
    getAllFinal2Evaluations,
    getSelectedFinal2EvaluationDetails,
    approveFinal2Evaluation
}