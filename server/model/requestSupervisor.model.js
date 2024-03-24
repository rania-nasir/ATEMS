const { sequelize, DataTypes } = require("../config/sequelize");

const supchangerequests = sequelize.define('supchangerequests', {
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
    ideaproposedby: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Supervisor', 'Student']]
        }
    },
    allowsametopic: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Allowed', 'Not Allowed']]
        }
    },
    currsupervisorname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    currsupervisorid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    newsupervisorname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    newsupervisorid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    initiatorComments: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    currSupReview: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
        validate: {
            isIn: [['Pending', 'Approved', 'Rejected']]
        }
    },
    gcComments: {
        type: DataTypes.TEXT('long'),
        defaultValue: '',
        allowNull: true
    },
    gcReview: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
        validate: {
            isIn: [['Pending', 'Approved', 'Rejected']]
        }
    },
    hodReview: {
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
    console.log('Supervisor request table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

// Export the title request model
module.exports = { supchangerequests };