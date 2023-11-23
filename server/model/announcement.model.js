const { sequelize, DataTypes } = require("./config/sequelize");

const Announcement = sequelize.define("announcements", {
    announcementID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    announcementTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    announcementContent: {
        type: DataTypes.STRING,
        allowNull: true
    },
    announcementType: {
        type: DataTypes.STRING,
        allowNull: false
    }

});

sequelize.sync().then(() => {
    console.log('Announcement table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = Announcement;