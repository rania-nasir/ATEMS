const { sequelize, DataTypes } = require("../config/sequelize");

const finalevaluations = sequelize.define('finalevaluations', {
    rollno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stdname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thesistitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    facname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    facultyid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    literaturereviewrank: {
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
    comparativeanalysisthorough: { // 2
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    researchgapclearlyidentified: { // 3
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    researchproblemclearlydefined: { // 4
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    problemcontextinliterature: { // 5
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    understandingofsolution: { // 6
        type: DataTypes.ENUM,
        values: ['e', 'f', 'g', 'h'],
        allowNull: false
    },
    proposedworkevaluation: { // 7
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    reportquality: { // 8
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    reportorganizationacceptable: { // 9
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    communicationskills: { // 10
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    questionshandling: { // 11
        type: DataTypes.ENUM,
        values: ['Good', 'Average', 'Bad'],
        allowNull: false
    },
    comments: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    gcfinalcommentsreview: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
        validate: {
            isIn: [['Pending', 'Approved', 'Rejected']]
        }
    },
    thesisonegrade: {
        type: DataTypes.CHAR,
        allowNull: true
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