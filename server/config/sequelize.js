const { Sequelize, DataTypes } = require("sequelize"); // using sequelize for data models
//const sequelize = new Sequelize('postgres://user:admin@localhost:5432/postgres')
require('dotenv').config()

const sequelize = new Sequelize( // Integrating Sequelize with .env database settings
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

module.exports = { sequelize, DataTypes };0