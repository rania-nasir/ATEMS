// Faculty Sign-In Function
const { sequelize } = require("../../../config/sequelize");
const { thesis } = require('../../../model/thesis.model');
const { students } = require("../../../model/student.model");
const { faculties } = require("../../../model/faculty.model");
const { registrations } = require("../../../model/thesistwo/registration.model");
const { twomidevaluations } = require("../../../model/thesistwo/thesisTwoMidEval.model");
const { twofinalevaluations } = require("../../../model/thesistwo/thesisTwoFinalEval.model");
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
            return res.json({ message: 'No approved request found for this student' });
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
            return res.json({ message: 'No pending request found for this student' });
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
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }


        const examinableThesis = await registrations.findAll({
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

        console.log("Examinable Permission ::: ", examinableThesisWithPermission);
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
            return res.json({ error: 'Forbidden - Insufficient permissions' });
        }


        const examinableThesis = await registrations.findAll({
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
            return res.json({ message: 'Mid evaluations are not open yet.' });
        }

        return res.json(examinableThesisWithPermission);

    } catch (error) {
        console.error('Error fetching examinabl theses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};


const mid2EvalDetails = async (req, res) => {

    try {
        const { rollno } = req.params;
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
            return res.json({ message: 'No evaluations found for this student' });
        }

        return res.json(registrationsThesis2);
    } catch (error) {
        console.error('Error fetching mid2 evaluations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const evaluateMid2 = async (req, res) => {
    try {
        const {
            rollno,
            stdname,
            thesistitle,
            facultyid,
            facultyname,
            reportfilename,
            englishlevel,
            abstract,
            introduction,
            research,
            literaturereview,
            researchgap,
            researchproblem,
            summary,
            researchcontribution,
            worktechniality,
            completeevaluation,
            relevantrefs,
            format,
            visuals,
            comments,
            externaldefense,
            suggestions,
            grade
        } = req.body;


        const existingEvaluation = await twomidevaluations.findOne({ where: { facultyid, rollno } });
        if (existingEvaluation) {
            res.json({ message: 'You have already evaluated this thesis proposal' });
            return;
        }

        // Validate request body fields here if necessary

        const newEvaluation = await twomidevaluations.create({
            rollno,
            stdname,
            thesistitle,
            facultyid,
            facultyname,
            gcapproval: 'Pending',
            reportfilename,
            englishlevel,
            abstract,
            introduction,
            research,
            literaturereview,
            researchgap,
            researchproblem,
            summary,
            researchcontribution,
            worktechniality,
            completeevaluation,
            relevantrefs,
            format,
            visuals,
            comments,
            externaldefense,
            suggestions,
            grade
        });

        return res.json({ message: 'Mid 2 evaluation completed successfully', evaluation: newEvaluation });
    } catch (error) {
        console.error('Error evaluating mid 2:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const supthesis2AllFinalEvals = async (req, res) => {
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
            return res.json({ message: 'Forbidden - Insufficient permissions' });
        }


        const examinableThesis = await twomidevaluations.findAll({
            where: {
                [Op.or]: [
                    { facultyid: facultyId },
                ]
            }
        });


        const examinableThesisWithPermission = [];
        for (const eachThesis of examinableThesis) {
            const final2Evaluations = await twomidevaluations.findOne({
                where: {
                    thesistitle: eachThesis.thesistitle,
                    gcfinalevalpermission: true
                }
            });
            if (final2Evaluations) {
                examinableThesisWithPermission.push(eachThesis);
            }
        }

        // Fetch final2EvaluationPermission
        const final2Evaluation = await twomidevaluations.findOne({
            attributes: ['gcfinalevalpermission'],
            limit: 1
        });

        // Check if final2EvaluationPermission is true
        if (!final2Evaluation || final2Evaluation.gcfinalevalpermission !== true) {
            return res.status(403).json({ error: 'Final evaluations are not open yet.' });
        }

        console.log("Examinable Permission ::: ", examinableThesisWithPermission);
        return res.json(examinableThesisWithPermission);

    } catch (error) {
        console.error('Error fetching examinable theses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const internalthesis2AllFinalEvals = async (req, res) => {
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
            return res.json({ error: 'Forbidden - Insufficient permissions' });
        }


        const examinableThesis = await registrations.findAll({
            where: {
                [Op.or]: [
                    { internalsid: { [Op.contains]: [facultyId] } }
                ]
            }
        });


        const examinableThesisWithPermission = [];
        for (const eachThesis of examinableThesis) {
            const final2Evaluations = await twomidevaluations.findOne({
                where: {
                    thesistitle: eachThesis.thesistitle,
                    gcfinalevalpermission: true
                }
            });
            if (final2Evaluations) {
                examinableThesisWithPermission.push(eachThesis);
            }
        }

        // Fetch final2EvaluationPermission
        const final2Evaluation = await twomidevaluations.findOne({
            attributes: ['gcfinalevalpermission'],
            limit: 1
        });

        // Check if final2EvaluationPermission is true
        if (!final2Evaluation || final2Evaluation.gcfinalevalpermission !== true) {
            return res.json({ message: 'Final evaluations are not open yet.' });
        }

        return res.json(examinableThesisWithPermission);

    } catch (error) {
        console.error('Error fetching examinable theses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const externalthesis2AllFinalEvals = async (req, res) => {
    try {
        const facultyId = req.userId;
        const examinableThesis = await twomidevaluations.findAll({
            where: {
                externalid: facultyId,
            }
        });

        if (!examinableThesis) {
            return res.json({ message: 'No Thesis found' });
        }

        const examinableThesisWithPermission = [];
        for (const eachThesis of examinableThesis) {
            const final2Evaluations = await twomidevaluations.findOne({
                where: {
                    thesistitle: eachThesis.thesistitle,
                    gcfinalevalpermission: true
                }
            });
            if (final2Evaluations) {
                examinableThesisWithPermission.push(eachThesis);
            }
        }

        // Fetch final2EvaluationPermission
        const final2Evaluation = await twomidevaluations.findOne({
            attributes: ['gcfinalevalpermission'],
            limit: 1
        });

        // Check if final2EvaluationPermission is true
        if (!final2Evaluation || final2Evaluation.gcfinalevalpermission !== true) {
            return res.json({ message: 'Final evaluations are not open yet.' });
        }

        return res.json(examinableThesisWithPermission);

    } catch (error) {
        console.error('Error fetching examinable theses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const final2EvalDetails = async (req, res) => {

    try {
        const { rollno } = req.params;
        const student = await students.findOne({
            where:
            {
                rollno: rollno,
            }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const finalThesis2 = await twomidevaluations.findAll({
            where: {
                rollno,
                gcfinalevalpermission: true,
            },
        });

        if (finalThesis2.length === 0) {
            return res.json({ message: 'No evaluations found for this student' });
        }

        return res.json(finalThesis2);
    } catch (error) {
        console.error('Error fetching final2 evaluations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const evaluateFinal2 = async (req, res) => {
    try {
        const facultyId = req.userId;
        const {
            rollno,
            stdname,
            thesistitle,
            supervisorname,
            supervisorid,
            // reportfilename,
            facultyid,
            facultyname,
            titleAppropriateness,
            titleComments,
            abstractClarity,
            abstractComments,
            introductionClarity,
            introductionComments,
            literatureReviewClarity,
            literatureReviewComments,
            researchContentRigor,
            researchContentComments,
            workEvaluation,
            workEvaluationComments,
            organizationQuality,
            organizationComments,
            languageQuality,
            languageComments,
            generalComments
        } = req.body;


        const existingEvaluation = await twofinalevaluations.findOne({
            where: {
                facultyid: facultyId,
                rollno
            }
        });
        if (existingEvaluation) {
            res.json({ message: 'You have already evaluated this thesis final' });
            return;
        }

        // Validate request body fields here if necessary

        const newEvaluation = await twofinalevaluations.create({
            rollno,
            stdname,
            thesistitle,
            supervisorname,
            supervisorid,
            gcFinalCommentsReview: 'Pending',
            // reportfilename,
            facultyid,
            facultyname,
            titleAppropriateness,
            titleComments,
            abstractClarity,
            abstractComments,
            introductionClarity,
            introductionComments,
            literatureReviewClarity,
            literatureReviewComments,
            researchContentRigor,
            researchContentComments,
            workEvaluation,
            workEvaluationComments,
            organizationQuality,
            organizationComments,
            languageQuality,
            languageComments,
            generalComments
        });

        return res.json({ message: 'Final 2 evaluation completed successfully', evaluation: newEvaluation });
    } catch (error) {
        console.error('Error evaluating Final 2:', error);
        res.status(500).json({ error: 'Internal server error' });
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
    evaluateMid2,
    supthesis2AllFinalEvals,
    internalthesis2AllFinalEvals,
    externalthesis2AllFinalEvals,
    final2EvalDetails,
    evaluateFinal2
};
