const { sequelize } = require("../../config/sequelize");
const { thesis } = require("../../model/thesis.model");
const { faculties } = require("../../model/faculty.model");
const { feedbacks } = require("../../model/feedback.model");
const { Op } = require('sequelize');
const { titlerequests } = require("../../model/requestTitle.model");
const { supchangerequests } = require("../../model/requestSupervisor.model");

/* Functions for the faculties who have MSRC roles to review and comment on accepted thesis so far by the GC */

// Recieve the accepted Thesis so far
const getAcceptedThesis = async (req, res) => {
    try {

        const facultyId = req.userId;
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["MSRC"] // only works for those faculties who have MSRC role
                },
            }
        });

        if (!faculty) {
            return res.json({ message: 'Forbidden - Insufficient permissions' }); // if MSRC role not found, display forbidden message
        }
        const acceptedThesis = await thesis.findAll({
            where: {
                gcapproval: 'Approved',
                hodapproval: 'Approved' // searches for Approved theses
            },
            attributes: ['thesisid', 'thesistitle', 'potentialareas', 'facultyid', 'supervisorname', 'gcapproval', 'hodapproval'],
        });


        if (acceptedThesis.length === 0) {
            return res.json({ message: 'No thesis found with both approvals' }); // if no theses found with both approvals
        }

        res.json({ acceptedThesis });

    } catch (error) {
        console.error('Error fetching accepted theses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get details for a single thesis
const getThesisDetails = async (req, res) => {
    try {
        const { thesisId } = req.params;

        const facultyId = req.userId;
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["MSRC"] // MSRC check on faculty
                },
            }
        });

        if (!faculty) {
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }

        const selectedThesis = await thesis.findOne({
            where: {
                thesisid: thesisId,
            },
        });

        if (!selectedThesis) {
            return res.json({ message: 'Thesis not found' });
        }

        const fileURL = `/uploads/${selectedThesis.proposalfilename}`; // Construct the file URL
        selectedThesis.dataValues.fileURL = fileURL;

        res.json({ selectedThesis });


    } catch (error) {
        console.error('Error fetching specific thesis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

// Provide feedback as MSRC on the thesis
const setThesisFeedback = async (req, res) => {
    try {
        const { thesisId } = req.params;

        const facultyId = req.userId;
        const faculty = await faculties.findOne({
            attributes: ['facultyid', 'name'],
            where: {
                facultyid: facultyId,
                role: {
                    [Op.contains]: ["MSRC"] // MSRC Check
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
            return res.json({ message: 'Thesis not found' });
        }

        const { comment } = req.body;


        const existingFeedback = await feedbacks.findOne({ // Check if feedback with MSRC tag exists or not
            where: {
                feedbackType: 'MSRC',
                rollno: selectedThesis.rollno,
                facultyid: facultyId
            },
        });

        if (existingFeedback) {
            console.log('This MSRC member has already given feedback for this student', comment);
            return res.json({ message: 'This MSRC member has already given feedback for this student' });
        }

        // Create a new feedback entry
        const newFeedback = await feedbacks.create({ // Create a new feedback with MSRC tag
            feedbackType: 'MSRC',
            rollno: selectedThesis.rollno,
            facultyid: facultyId,
            facultyname: faculty.name,
            feedbackContent: comment,
        });

        res.json({ message: 'Feedback submitted successfully', newFeedback });



    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};



module.exports = { getAcceptedThesis, getThesisDetails, setThesisFeedback };