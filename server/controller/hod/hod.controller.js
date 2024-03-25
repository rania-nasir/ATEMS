const { sequelize } = require("../../config/sequelize");
const { thesis } = require("../../model/thesis.model");
const { faculties } = require("../../model/faculty.model");
const { students } = require("../../model/student.model");
const { sendMail } = require("../../config/mailer");
const { Op } = require('sequelize');
const { supchangerequests } = require("../../model/requestSupervisor.model");

const getThesis = async (req, res) => {
    try {
        const allThesis = await thesis.findAll({
            where: {
                hodapproval: 'Pending' // only pending thesis will be fetched
            },
            attributes: ['thesisid', 'rollno', 'facultyid', 'supervisorname', 'thesistitle', 'potentialareas', 'gcapproval'],
        });

        res.json({ allThesis });

    } catch (error) {
        console.error('Error fetching thesis for review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const onethesisDetails = async (req, res) => {
    try {
        // hod will choose an id for review
        const { thesisId } = req.params;
        const facultyId = req.userId;


        const selectedThesis = await thesis.findOne({
            where: {
                thesisid: thesisId
            },
        });


        // Check if the faculty exists and fetch its role
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId
            }
        });

        if (!faculty) {
            return res.json({ error: 'Faculty not found' });
        }

        const facultyRole = faculty.role;

        if (facultyRole.includes('HOD')) {
            // Functionality for HOD
            const selectedThesis = await thesis.findOne({
                where: {
                    thesisid: thesisId
                },
            });

            if (!selectedThesis) {
                return res.status(404).json({ error: 'Thesis not found' });
            }

            const fileURL = `/uploads/${selectedThesis.proposalfilename}`; // Construct the file URL
            selectedThesis.dataValues.fileURL = fileURL; // Add the file URL to the selectedThesis object

            res.json({ selectedThesis });

        } else {
            // If the faculty does not have the role of HOD
            return res.status(403).json({ error: 'Access forbidden. Only HOD can perform this functionality' });
        }

    } catch (error) {

        console.error('Error fetching thesis details:', error);
        res.status(500).json({ error: 'Internal server error' });

    }
};






const hodapproveThesis = async (req, res) => {
    try {
        // hod will choose an id for review
        const { thesisId } = req.params;
        const facultyId = req.userId;

        // Check if the faculty exists and fetch its role
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId
            }
        });

        if (!faculty) {
            return res.json({ message: 'Faculty not found' });
        }

        const facultyRole = faculty.role;
        console.log('facultyRole:', facultyRole);

        if (facultyRole.includes('HOD')) {
            const selectedThesis = await thesis.findOne({
                where: {
                    thesisid: thesisId
                },
            });

            if (!selectedThesis) {
                return res.status(404).json({ error: 'Thesis not found' });
            }

            if (selectedThesis.gcapproval !== 'Approved') {
                return res.json({ message: 'GC approval is required before HOD approval' });
            }

            const [rowsAffected, [updatedThesis]] = await thesis.update(
                {
                    hodapproval: 'Approved',
                },
                {
                    where: {
                        thesisid: thesisId
                    },
                    returning: true,
                }
            );

            if (rowsAffected === 0) {
                return res.json({ message: 'Thesis not found' });
            }

            const student = await students.findOne({
                where: {
                    rollno: selectedThesis.rollno.toString()
                }
            });

            if (!student) {
                return res.json({ message: 'Student not found for the given synopsis' });
            }

            const facultyName = faculty.name;
            const toEmail = student.email;
            const subject = 'Thesis Approved';
            const text = `Dear Student,
        
        Your thesis has been approved by Head of Department ${facultyName} (Faculty ID: ${facultyId}).
        Your thesis internal examiners are ${selectedThesis.internals}.
  
        Best of luck for your thesis!
        Regards,`;

            try {
                await sendMail(toEmail, subject, text);
                //res.json({ message: 'Thesis approved and email sent to student', updatedThesis });
            } catch (error) {
                console.error('Error sending email to student:', error);
                return res.json({ message: 'Error sending approval email to student' });
            }
            // Fetch all faculty members with the MSRC role
            const msrcFaculty = await faculties.findAll({
                where: {
                    role: { [Op.contains]: ['MSRC'] }
                },
                attributes: ['email']
            });

            const msrcEmails = msrcFaculty.map(member => member.email);

            // Send email to MSRC members
            const msrcSubject = 'Review Approved Thesis';
            const msrcText = `Dear MSRC Member,
                    
    The following thesis has been approved by the Head of Department:
            Thesis ID: ${thesisId}
            Title: ${selectedThesis.thesistitle}
            Supervisor: ${selectedThesis.supervisorname}

            Kindly provide your feedback on the thesis.
            Best regards,`;

            try {
                await sendMail(msrcEmails, msrcSubject, msrcText);
            } catch (error) {
                console.error('Error sending email to MSRC members:', error);
                return res.json({ message: 'Error sending approval email to MSRC members' });
            }

            res.json({ message: 'Thesis approved and emails sent', updatedThesis });
        } else {
            return res.json({ message: 'Access forbidden. Only HOD can approve the thesis' });
        }
    } catch (error) {
        console.error('Error approving thesis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getSupervisorChangeRequests = async (req, res) => {
    try {
        const facultyId = req.userId;
        const faculty = await faculties.findOne({
            attributes: ['facultyid', 'name'],
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["HOD"] // HOD Check
                },
            }
        });
        if (!faculty) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }

        const pendingSupervisorChangeRequests = await supchangerequests.findAll({
            where: {
                currSupReview: 'Approved',
                gcReview: 'Approved',
                hodReview: 'Pending',
            }
        });

        if (!pendingSupervisorChangeRequests) {
            return res.json({ message: 'No pending supervisor change requests found' });
        }

        res.json(pendingSupervisorChangeRequests);

    } catch (error) {
        console.error('Error fetching pending supervisor requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getSupervisorChangeDetails = async (req, res) => {
    try {
        const facultyId = req.userId;
        const rollno = req.params.rollno;

        const faculty = await faculties.findOne({
            attributes: ['facultyid', 'name'],
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["HOD"] // HOD Check
                },
            }
        });
        if (!faculty) {
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        const supervisorRequestDetails = await supchangerequests.findOne({
            where: {
                rollno: rollno,
                currSupReview: 'Approved',
                gcReview: 'Approved',
                hodReview: 'Pending',
            }
        });

        if (!supervisorRequestDetails) {
            return res.json({ message: 'No pending supervisor change requests found' });
        }

        res.json(supervisorRequestDetails);

    } catch (error) {
        console.error('Error fetching pending supervisor request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const approveSupervisorChangeHOD = async (req, res) => {
    try {
        const facultyId = req.userId;
        const rollno = req.params.rollno;

        const faculty = await faculties.findOne({
            attributes: ['facultyid', 'name'],
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["HOD"] // HOD Check
                },
            }
        });
        if (!faculty) {
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        const SupervisorRequestDetails = await supchangerequests.findOne({
            where: {
                rollno: rollno,
                currSupReview: 'Approved',
                gcReview: 'Approved',
                hodReview: 'Pending',
            }
        });

        if (SupervisorRequestDetails) {
            const [updatedRows] = await supchangerequests.update(
                {
                    //msrcid: facultyId,
                    hodReview: 'Approved',
                },
                { where: { rollno: rollno } }
            );
            if (updatedRows > 0) {
                const [updatedRowsRows] = await thesis.update(
                    {
                        facultyid: SupervisorRequestDetails.newsupervisorid,
                        supervisorname: SupervisorRequestDetails.newsupervisorname,
                    },
                    { where: { rollno: rollno } }
                );

                if (updatedRowsRows > 0) {
                    return res.json({ message: 'Supervisor Change Request Approved'});
                }
                else {
                    return res.json({ message: 'Error approving pending supervisor change request' });
                }
            }
            else {
                return res.json({ message: 'Error approving pending supervisor change request' });
            }
        }
        else {
            return res.status(404).json({ error: 'No pending supervisor change requests found' });
        }
    } catch (error) {
        console.error('Error approving pending title request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const rejectSupervisorChangeHOD = async (req, res) => {
    try {
        const facultyId = req.userId;
        const rollno = req.params.rollno;

        const faculty = await faculties.findOne({
            attributes: ['facultyid', 'name'],
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["HOD"] // HOD Check
                },
            }
        });
        if (!faculty) {
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        const SupervisorRequestDetails = await supchangerequests.findOne({
            where: {
                rollno: rollno,
                currSupReview: 'Approved',
                gcReview: 'Approved',
                hodReview: 'Pending',
            }
        });

        if (SupervisorRequestDetails) {
            const [updatedRows] = await supchangerequests.update(
                {
                    //msrcid: facultyId,
                    hodReview: 'Rejected',
                },
                { where: { rollno: rollno } }
            );
            if (updatedRows > 0) {

                return res.json({ message: 'Supervisor Change Request Rejected'});
            }
            else {
                return res.json({ message: 'Error rejecting pending supervisor change request' });
            }
        }
        else {
            return res.json({ message: 'No pending supervisor change requests found' });
        }
    } catch (error) {
        console.error('Error approving pending title request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports =
{
    getThesis,
    onethesisDetails,
    hodapproveThesis,
    getSupervisorChangeRequests,
    getSupervisorChangeDetails,
    approveSupervisorChangeHOD,
    rejectSupervisorChangeHOD

}