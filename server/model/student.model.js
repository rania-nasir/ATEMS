const { sequelize, DataTypes } = require("../config/sequelize");

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
        type: DataTypes.CHAR,
        allowNull: false
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
    cgpa: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    mobile: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
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
    console.log('Student table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = { students };