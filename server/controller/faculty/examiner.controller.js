const { sequelize } = require("../../config/sequelize");
const { thesis } = require("../../model/thesis.model");
const { faculties } = require("../../model/faculty.model");
const { midevaluations } = require("../../model/midEvaluation.model");
const { finalevaluations } = require("../../model/finalEvaluation.model")
const { proposalevaluations } = require("../../model/proposalEvaluaton.model")
const { Op } = require('sequelize');


const getExaminableThesis = async (req, res) => {
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
                    { facultyid: facultyId }, // If the faculty is the supervisor
                    { internalsid: { [Op.contains]: [facultyId] } } // If the faculty is one of the internals
                ]
            }
        });

        const examinableThesisWithPermission = [];
        for (const eachThesis of examinableThesis) {
            const proposalEvaluation = await proposalevaluations.findOne({
                where: {
                    thesistitle: eachThesis.thesistitle,
                    midEvaluationPermission: true
                }
            });
            if (proposalEvaluation) {
                examinableThesisWithPermission.push(eachThesis);
            }
        }

        // Respond with the filtered list of examinable thesis papers
        return res.json(examinableThesisWithPermission);

    } catch (error) {
        console.error('Error fetching examinabl theses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getExaminableThesisDetails = async (req, res) => {
    try {
        const thesisId = req.params.thesisid;
        const facultyId = req.userId;

        const faculty = await thesis.findOne({
            where: {
                thesisid: thesisId,
                [Op.or]: [
                    { facultyid: facultyId },
                    { internalsid: { [Op.contains]: [facultyId] } }
                ]
            }
        });

        if (!faculty) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }

        // Find the thesis with the given ID
        const thesisDetails = await thesis.findOne({
            where: {
                thesisid: thesisId
            },
            attributes: ['thesisid', 'thesistitle', 'rollno', 'researcharea', 'potentialareas', 'proposalfilename'],
        });

        if (!thesisDetails) {
            return res.status(404).json({ error: 'Thesis not found' });
        }

        // Find the student associated with the thesis
        const studentDetails = await students.findOne({
            where: {
                rollno: thesisDetails.rollno
            },
            attributes: ['rollno', 'name', 'email', 'gender', 'batch', 'semester', 'program', 'credithours', 'cgpa', 'mobile', 'thesisstatus', 'comingevaluation', 'reevaluationstatus'],
        });

        if (!studentDetails) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if the comingevaluation is set to Mid1
        if (studentDetails.comingevaluation !== 'Mid1') {
            return res.status(400).json({ error: 'Thesis evaluation is not set for Mid1' });
        }

        return res.json({
            thesisDetails,
            studentDetails
        });

    } catch (error) {
        console.error('Error fetching thesis and student details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getExaminableThesis, getExaminableThesisDetails };