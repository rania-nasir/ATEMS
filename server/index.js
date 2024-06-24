const express = require('express')
const app = express()
const path = require('path');

const { Sequelize, DataTypes } = require('./config/sequelize.js');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.use(express.json());

const sequelize = require('./config/sequelize.js')

require('dotenv').config()
const port = process.env.port || 3001

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const gcRoute = require("./router/gcRoutes")
const stdRoute = require("./router/stdRoutes")
const facultyRoute = require("./router/facultyRoutes")
const forgetPasswordRoutes = require("./router/forgetPasswordRoutes")

app.use("/gc", gcRoute)
app.use("/std", stdRoute)
app.use("/faculty", facultyRoute)
app.use("/password", forgetPasswordRoutes)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})