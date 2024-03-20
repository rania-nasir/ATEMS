// Faculty Sign-In Function
const { sequelize } = require("../../../config/sequelize");
const { registrations } = require("../../../model/thesistwo/registration.model");
const { Op } = require('sequelize');


const getThesis2Students = async (req, res) => {
    try {
        const facultyId = req.userId;

        const allStudents = await registrations.findAll({
            where: {
                facultyid: facultyId,
                supervisorapproval: 'Pending'
            },
            attributes: ['rollno', 'stdname', 'thesistitle', 'internals']
        });
        res.json({ allStudents });
    }
    catch (error) {
        console.error('Error getting thesis two registration requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}


const getThesis2StudentDetails = async (req, res) => {
    try {
        const { rollno } = req.params;

        const studentDetails = await registrations.findOne({
            where: {
                rollno: rollno,
                supervisorapproval: 'Pending'
            },
        });

        if (!studentDetails) {
            return res.status(404).json({ message: 'No approved request found for this student' });
        }

        res.json({ studentDetails });
    }

    catch (error) {
        console.error('Error getting thesis two registration requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}


const approveThesis2Request = async (req, res) => {
    try {
        const { rollno } = req.params;


        // const studentRegistration = await registrations.findOne({
        //     where: {
        //         rollno: rollno,
        //         supervisorapproval: 'Pending'
        //     }
        // });

        // if (!studentRegistration) {
        //     return res.status(404).json({ message: 'No pending request found for this student' });
        // }


        const studentRegistration = await getThesis2StudentDetails(rollno);


        await studentRegistration.update({
            supervisorapproval: 'Approved'
        });

        res.json({ message: 'Request approved successfully' });
    } catch (error) {
        console.error('Error approving thesis two request:', error);
        res.status(500).json({ message: 'An error occurred while approving the request' });
    }

};



module.exports =
{
    getThesis2Students,
    getThesis2StudentDetails,
    approveThesis2Request
};
