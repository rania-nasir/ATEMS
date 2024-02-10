const { sequelize, DataTypes } = require("../config/sequelize");

const panels = sequelize.define('panels', {

    thesisid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    rollno: {
        type: DataTypes.STRING,
        allowNull: false
    },

    stdname: {
        type: DataTypes.STRING,
        allowNull: false
    },

    thesistitle: {
        type: DataTypes.STRING,
        allowNull: false
    },

    supervisorname : {
      type: DataTypes.STRING,
      allowNull: false 
    },

    internals: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false
    },

    timeslot: {
        type: DataTypes.DATE,
        allowNull: false
    },

    evaluation: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Proposal', 'Mid', 'Final']]
        }
    }

});

sequelize.sync().then(() => {

    console.log('Panels table created successfully!');

}).catch((error) => {

    console.error('Unable to create table : ', error);
    
});

// Export the panel model
module.exports = { panels };