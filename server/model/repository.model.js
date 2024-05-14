const { sequelize, DataTypes } = require("../config/sequelize");

const repository = sequelize.define("repository", {
    thesistitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rollno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stdname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    supervisorid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    supervisorname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thesisfilename: {
        type: DataTypes.STRING,
        allowNull: false,
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
    console.log('Repository table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = { repository };