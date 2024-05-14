const { sequelize, DataTypes } = require("../../config/sequelize");

const twomidevaluations = sequelize.define('twomidevaluations', {

    rollno: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    stdname: {
        type: DataTypes.STRING,
        allowNull: false
    },

    thesistitle: {
        type: DataTypes.STRING,
        allowNull: false
    },

    facultyid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    facultyname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    externalid: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    gcapproval: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['Pending', 'Ready', 'CN', 'F']]
        }
    },

    reportfilename: {
        type: DataTypes.STRING,
        allowNull: false
    },

    gcfinalevalpermission: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    englishlevel: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    abstract: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    introduction: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    research: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    literaturereview: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    researchgap: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    researchproblem: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    summary: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },

    researchcontribution: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    worktechniality: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    completeevaluation: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    relevantrefs: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    format: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    visuals: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    comments: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },

    externaldefense: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    suggestions: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },

    grade: {
        type: DataTypes.STRING,
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
    console.log('Thesis 2 Mid Evaluation table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});


module.exports = { twomidevaluations }; 