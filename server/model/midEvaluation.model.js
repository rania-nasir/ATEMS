const { sequelize, DataTypes } = require("../config/sequelize");

const midevaluations = sequelize.define('midevaluations', {
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
    facultyid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    proposalEvaluated: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    midEvaluationPermission: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    midEvaluationAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    literatureReviewRank: {
        type: DataTypes.ENUM,
        values: ['a', 'b', 'c', 'd'],
        allowNull: false
    },
    paper1: {
        type: DataTypes.STRING,
        allowNull: true // Nullable because it's only required if literatureReviewRank is 'c'
    },
    paper2: {
        type: DataTypes.STRING,
        allowNull: true // Nullable because it's only required if literatureReviewRank is 'c'
    },
    problemGapIdentified: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    problemClearlyDefined: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    problemPlacement: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    solutionUnderstanding: {
        type: DataTypes.ENUM,
        values: ['a', 'b', 'c', 'd'],
        allowNull: false
    },
    comments: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    internalname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    internalid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    gcMidCommentsReview: {
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
    console.log('Mid Evaluation table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

// Export the Proposal Evaluaton model
module.exports = { midevaluations };