const { sequelize, DataTypes } = require("../config/sequelize");
 
 const Faculty = sequelize.define("faculties", {
    facultyid: {
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
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    role: {
      type: DataTypes.INTEGER, 
      allowNull: true
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
    console.log('Faculty table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });