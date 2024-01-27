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
    potentialareas: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rollno: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    facultyid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    facultyname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    proposalfilename: {
        type: DataTypes.STRING, 
        allowNull: false, 
    },
    synopsisstatus: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['Pending', 'Rejected', 'Approved']]
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
    console.log('Synopsis table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

// Export the Synopsis model
module.exports = { synopsis }; 