// Faculty Sign-In Function
const { sequelize } = require("../../../config/sequelize");
const { thesis } = require('../../../model/thesis.model');
const { students } = require("../../../model/student.model");
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


        const studentRegistration = await registrations.findOne({
            where: {
                rollno: rollno,
                supervisorapproval: 'Pending'
            }
        });

        if (!studentRegistration) {
            return res.status(404).json({ message: 'No pending request found for this student' });
        }



        await studentRegistration.update({
            supervisorapproval: 'Approved'
        });

        res.json({ message: 'Request approved successfully' });
    } catch (error) {
        console.error('Error approving thesis two request:', error);
        res.status(500).json({ message: 'An error occurred while approving the request' });
    }

};



const supthesis2AllMidEvals = async (req, res) => {
    try {

        const facultyId = req.userId;
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.or]: [
                        { [Op.contains]: ["Supervisor"] },
                        { [Op.contains]: ["Internal"] }
                    ]
                },
            }
        });

        if (!faculty) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }


        const examinableThesis = await thesis.findAll({
            where: {
                [Op.or]: [
                    { facultyid: facultyId },
                ]
            }
        });


        const examinableThesisWithPermission = [];
        for (const eachThesis of examinableThesis) {
            const mid2Evaluations = await registrations.findOne({
                where: {
                    thesistitle: eachThesis.thesistitle,
                    gcmidevalpermission: true
                }
            });
            if (mid2Evaluations) {
                examinableThesisWithPermission.push(eachThesis);
            }
        }

        // Fetch mid2EvaluationPermission
        const mid2Evaluation = await registrations.findOne({
            attributes: ['gcmidevalpermission'],
            limit: 1
        });

        // Check if mid2EvaluationPermission is true
        if (!mid2Evaluation || mid2Evaluation.gcmidevalpermission !== true) {
            return res.status(403).json({ error: 'Mid evaluations are not open yet.' });
        }

        return res.json(examinableThesisWithPermission);

    } catch (error) {
        console.error('Error fetching examinabl theses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};


const internalthesis2AllMidEvals = async (req, res) => {
    try {

        const facultyId = req.userId;
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.or]: [
                        { [Op.contains]: ["Supervisor"] },
                        { [Op.contains]: ["Internal"] }
                    ]
                },
            }
        });

        if (!faculty) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }


        const examinableThesis = await thesis.findAll({
            where: {
                [Op.or]: [
                    { internalsid: { [Op.contains]: [facultyId] } }
                ]
            }
        });


        const examinableThesisWithPermission = [];
        for (const eachThesis of examinableThesis) {
            const mid2Evaluations = await registrations.findOne({
                where: {
                    thesistitle: eachThesis.thesistitle,
                    gcmidevalpermission: true
                }
            });
            if (mid2Evaluations) {
                examinableThesisWithPermission.push(eachThesis);
            }
        }

        // Fetch mid2EvaluationPermission
        const mid2Evaluation = await registrations.findOne({
            attributes: ['gcmidevalpermission'],
            limit: 1
        });

        // Check if mid2EvaluationPermission is true
        if (!mid2Evaluation || mid2Evaluation.gcmidevalpermission !== true) {
            return res.status(403).json({ error: 'Mid evaluations are not open yet.' });
        }

        return res.json(examinableThesisWithPermission);

    } catch (error) {
        console.error('Error fetching examinabl theses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};


const mid2EvalDetails = async (req, res) => {

    try {
        const rollno = req.params.rollno;
        const student = await students.findOne({ where: { rollno } });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const registrationsThesis2 = await registrations.findAll({
            where: {
                rollno,
                gcmidevalpermission: true,
            },
        });

        if (registrationsThesis2.length === 0) {
            return res.status(404).json({ error: 'No evaluations found for this student' });
        }

        return res.json(registrations);
    } catch (error) {
        console.error('Error fetching mid2 evaluations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const evaluateMid2 = async (req, res) => {
    try {

    }

    catch {

    }

};


module.exports =
{
    getThesis2Students,
    getThesis2StudentDetails,
    approveThesis2Request,
    supthesis2AllMidEvals,
    internalthesis2AllMidEvals,
    mid2EvalDetails,
    evaluateMid2
};
