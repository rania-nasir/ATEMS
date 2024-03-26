const { sequelize } = require("../../../config/sequelize");
const { registrations } = require("../../../model/thesistwo/registration.model");
const { faculties } = require("../../../model/faculty.model");
const { sendMail } = require("../../../config/mailer");
const { students } = require("../../../model/student.model");
const { authenticate } = require('../../../middleware/authMiddleware');
const { Op } = require('sequelize');


const getHodThesis2Students = async (req, res) => {
    try {

        const facultyId = req.userId;
        const faculty = await faculties.findOne({ where: { facultyid: facultyId } });

        if (!faculty || !faculty.role.includes('HOD')) {
            return res.status(403).json({ message: 'Only HOD faculty members have access' });
        }

        const pendingRequests = await registrations.findAll({
            where: {
                gcapproval: 'Pending',
                supervisorapproval: 'Approved',
                gcapproval: 'Approved',
                hodapproval: 'Pending'
            },
            attributes: ['rollno', 'stdname', 'thesistitle', 'internals']
        });

        res.json({ pendingRequests });

    } catch (error) {
        console.error('Error getting thesis two registration requests:', error);
        res.status(500).json({ message: 'An error occurred while fetching the requests' });
    }
}


const getHodThesis2StudentDetails = async (req, res) => {
    try {

        const facultyId = req.userId;
        const faculty = await faculties.findOne({ where: { facultyid: facultyId } });

        if (!faculty || !faculty.role.includes('HOD')) {
            return res.status(403).json({ message: 'Only HOD faculty members have access' });
        }

        
        const { rollno } = req.params;

        const studentDetails = await registrations.findOne({
            where: {
                rollno: rollno,
                supervisorapproval: 'Approved',
                gcapproval: 'Approved',
                hodapproval: 'Pending'
            },
        });

        if (!studentDetails) {
            return res.json({ message: 'No pending request found for this student' });
        }

        res.json({ studentDetails });
    }

    catch {
        res.status(500).json({ error: 'Internal server error' });
    }
}


const approveHodThesis2Request = async (req, res) => {
    try {
        const { rollno } = req.params;

        const facultyId = req.userId;
        const faculty = await faculties.findOne({ where: { facultyid: facultyId } });

        if (!faculty || !faculty.role.includes('HOD')) {
            return res.status(403).json({ message: 'Only HOD faculty members have access' });
        }

        const studentRegistration = await registrations.findOne({
            where: {
                rollno: rollno,
                supervisorapproval: 'Approved',
                gcapproval: 'Approved',
                hodapproval: 'Pending'
            }
        });


        if (!studentRegistration) {
            return res.json({ message: 'No pending request found for this student' });
        }

        await studentRegistration.update({
            hodapproval: 'Approved'
        });


        const student = await students.findOne({ where: { rollno: rollno } }); // Find the student by roll number
        if (student) {
            const subject = 'Thesis-2 Approval';
            const text = `Your thesis approval has been approved by HOD ${faculty.facultyname} for roll number: ${rollno}. You can now login to your account and constinue for further actions.
            
            Best of luck for your thesis evlauations!`;

            await sendMail(student.email, subject, text, ''); // Send email to the student
        } else {
            console.error('Student not found for roll number: ', rollno);
        }


        res.json({ message: 'Request approved successfully. Email sent to the respective members.' });

    } catch (error) {
        console.error('Error approving thesis two registration request:', error);
        res.status(500).json({ message: 'An error occurred while approving the request' });
    }
}



module.exports =
{
    getHodThesis2Students,
    getHodThesis2StudentDetails,
    approveHodThesis2Request
}