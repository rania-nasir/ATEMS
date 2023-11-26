const { sequelize, DataTypes } = require("../config/sequelize");

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
    internals: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false
    },
    internalsid: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [],
        allowNull: false
    }
});

sequelize.sync().then(() => {
    console.log('Thesis table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

// Export the Thesis model
module.exports = { thesis };