const { sequelize, DataTypes } = require("../config/sequelize");
const { synopsis } = require("./synopsis.model");
const { thesis } = require("./thesis.model");

const students = sequelize.define("students", {
    rollno: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Male', 'Female']]
        }
    },
    batch: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    program: {
        type: DataTypes.STRING,
        allowNull: false
    },
    credithours: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cgpa: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
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
    comingevaluation: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Proposal', 'Mid1', 'Final1', 'Mid2', 'Final2']]
        }
    },
    reevaluationstatus: {
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

// students.belongsTo(synopsis, {
//     foreignKey: 'rollno',
//     targetKey: 'rollno',
//     as: 'synopsis',
// });


// // Define the association after all models have been imported
// synopsis.hasMany(students, {
//     foreignKey: 'rollno',
//     sourceKey: 'rollno',
//     as: 'students',
// });


// students.hasMany(thesis, {
//     foreignKey: 'rollno',
//     sourceKey: 'rollno',
//     as: 'theses',
// });

sequelize.sync().then(() => {
    console.log('Student table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = { students };