const { sequelize, DataTypes } = require("../../config/sequelize");

const twofinalevaluations = sequelize.define('twofinalevaluations', {
    thesisid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    thesistitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    supervisorname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    supervisorid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    examinerid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    examinername: {
        type: DataTypes.STRING,
        allowNull: false
    },
    assignedexternalid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    titleAppropriateness: {
        type: DataTypes.ENUM('Yes', 'No', 'Unsure'),
        allowNull: false
    },
    titleComments: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    abstractClarity: {
        type: DataTypes.ENUM('Yes', 'No', 'Unsure'),
        allowNull: false
    },
    abstractComments: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    introductionClarity: {
        type: DataTypes.ENUM('Yes', 'No', 'Unsure'),
        allowNull: false
    },
    introductionComments: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    literatureReviewClarity: {
        type: DataTypes.ENUM('Yes', 'No', 'Unsure'),
        allowNull: false
    },
    literatureReviewComments: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    researchContentRigor: {
        type: DataTypes.ENUM('Yes', 'No', 'Unsure'),
        allowNull: false
    },
    researchContentComments: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    workEvaluation: {
        type: DataTypes.ENUM('Yes', 'No', 'Unsure'),
        allowNull: false
    },
    workEvaluationComments: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    organizationQuality: {
        type: DataTypes.ENUM('Yes', 'No', 'Unsure'),
        allowNull: false
    },
    organizationComments: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    languageQuality: {
        type: DataTypes.ENUM('Yes', 'No', 'Unsure'),
        allowNull: false
    },
    languageComments: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    generalComments: {
        type: DataTypes.TEXT,
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
    console.log('Thesis 2 Final Evaluation table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});


module.exports = { twofinalevaluations }; 