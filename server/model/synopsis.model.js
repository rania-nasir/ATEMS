const { sequelize, DataTypes } = require("../config/sequelize");

const synopsis = sequelize.define('synopsis', {
    synopsisid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    synopsistitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    rollno: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    facultyid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    facultyname: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

sequelize.sync().then(() => {
    console.log('Synopsis table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

// Export the Synopsis model
module.exports = { synopsis }; 