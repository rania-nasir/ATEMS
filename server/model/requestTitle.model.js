const { sequelize, DataTypes } = require("../config/sequelize");

const titlerequests = sequelize.define('titlerequests', {
    thesisid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rollno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stdname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thesisstatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isIn: {
                args: [[1, 2]],
                msg: "Thesis status must be 1 or 2"
            }
        }
    },
    currentThesisTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    newThesisTitle: {
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
    supervisorComments: {
        type: DataTypes.TEXT('long'),
        defaultValue: '',
        allowNull: true
    },
    estimatedChange: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true
    },
    supervisorReview: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
        validate: {
            isIn: [['Pending', 'Approved', 'Rejected']]
        }
    },
    msrcid: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    },
    msrcComments: {
        type: DataTypes.TEXT('long'),
        defaultValue: '',
        allowNull: true
    },
    msrcReview: {
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
})

sequelize.sync().then(() => {
    console.log('Title request table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

// Export the title request model
module.exports = { titlerequests };