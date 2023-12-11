const { sequelize, DataTypes } = require("../config/sequelize");

const feedbacks = sequelize.define("feedbacks", {
    feedbackID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    feedbackType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rollno: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    facultyid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    facultyname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    feedbackContent: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

sequelize.sync().then(() => {
    console.log('Feedback table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = { feedbacks };