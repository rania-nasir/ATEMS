const { sequelize, DataTypes } = require("../../config/sequelize");

const registrations = sequelize.define('registrations', {
    registrationid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    stdname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rollno: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    thesistitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    facultyid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    supervisorname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    internals: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false
    },
    internalsid: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [],
        allowNull: false
    },
    tasktitles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false
    },
    objectives: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false
    },
    completiondates: {
        type: DataTypes.ARRAY(DataTypes.DATE),
        defaultValue: [],
        allowNull: false
    },
    supervisorapproval: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['Pending', 'Approved']]
        }
    },
    gcapproval: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['Pending', 'Approved']]
        }
    },
    hodapproval: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['Pending', 'Approved']]
        }
    },
    gcmidevalpermission: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    console.log('Synopsis table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

// Export the Synopsis model
module.exports = { registrations }; 