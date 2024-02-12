const { sequelize, DataTypes } = require("../config/sequelize");
const { students } = require("./student.model");

const thesis = sequelize.define('thesis', {
    thesisid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    thesistitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rollno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    facultyid: {
        type: DataTypes.INTEGER,
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
    researcharea: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false
    },
    potentialareas: {
        type: DataTypes.STRING,
        allowNull: false
    },
    proposalfilename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gcapproval: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Pending', 'Approved']]
        }
    },
    hodapproval: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Pending', 'Approved']]
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
    console.log('Thesis table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

// Export the Thesis model
module.exports = { thesis };