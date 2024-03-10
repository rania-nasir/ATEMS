const { sequelize, DataTypes } = require("../config/sequelize");

const finalevaluations = sequelize.define('finalevaluations', {
    rollno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thesistitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thesisid: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    facname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    literatureReviewRank: {
        type: DataTypes.ENUM,
        values: ['e', 'f', 'g', 'h'],
        allowNull: false
    },
    paper1: {
        type: DataTypes.STRING,
        allowNull: true // Nullable because it's only required if literatureReviewRank is 'g'
    },
    paper2: {
        type: DataTypes.STRING,
        allowNull: true // Nullable because it's only required if literatureReviewRank is 'g'
    },
    comparativeAnalysisThorough: {
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    researchGapClearlyIdentified: {
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    researchProblemClearlyDefined: {
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    problemContextInLiterature: {
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    understandingOfSolution: {
        type: DataTypes.ENUM,
        values: ['e', 'f', 'g', 'h'],
        allowNull: false
    },
    proposedWorkEvaluation: {
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    reportQuality: {
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    reportOrganizationAcceptable: {
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    communicationSkills: {
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    questionsHandling: {
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    comments: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    gcFinalCommentsReview: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
        validate: {
            isIn: [['Pending', 'Approved', 'Rejected']]
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
});

sequelize.sync().then(() => {
    console.log('Final Evaluation table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

// Export the Final Evaluation model
module.exports = { finalevaluations };