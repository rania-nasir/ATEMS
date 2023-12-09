const { sequelize } = require("../../config/sequelize");
const { thesis } = require("../../model/thesis.model");
const { faculties } = require("../../model/faculty.model");
const { feedbacks } = require("../../model/feedback.model");
const { Op } = require('sequelize');

/* Functions for the faculties who have MSRC roles to review and comment on accepted thesis so far by the GC */

const getAcceptedThesis = async (req, res) => {
    try {

        const facultyId = req.userId;
        console.log('Passed 1');
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["MSRC"]
                },
            }
        });

        console.log('Passed 2');
        if (!faculty) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }
        console.log('Passed 3');
        const acceptedThesis = await thesis.findAll({
            where: {
                thesisstatus: 'Approved'
            },
            attributes: ['thesisid', 'thesistitle', 'description'],
        });
        console.log('Passed 4');

        res.json({ acceptedThesis });
    } catch (error) {
        console.error('Error fetching accepted theses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getThesisDetails = async (req, res) => {
    try {
        const { thesisId } = req.params;

        const facultyId = req.userId;
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["MSRC"]
                },
            }
        });

        if (!faculty) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }

        const selectedThesis = await thesis.findOne({
            where: {
                thesisid: thesisId,
            },
        });

        if (!selectedThesis) {
            return res.status(404).json({ error: 'Thesis not found' });
        }

        res.json({ selectedThesis });


    } catch (error) {
        console.error('Error fetching specific thesis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const setThesisFeedback = async (req, res) => {
    try {
        const { thesisId } = req.params;

        const facultyId = req.userId;
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["MSRC"]
                },
            }
        });

        if (!faculty) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }

        const selectedThesis = await thesis.findOne({
            where: {
                thesisid: thesisId,
            },
        });

        if (!selectedThesis) {
            return res.status(404).json({ error: 'Thesis not found' });
        }

        const { comment } = req.body;

        // Create a new feedback entry
        const newFeedback = await feedbacks.create({
            feedbackType: 'MSRC',
            rollno: selectedThesis.rollno,
            feedbackContent: comment,
        });

        res.json({ newFeedback });



    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

module.exports = { getAcceptedThesis, getThesisDetails, setThesisFeedback };