const express = require('express')
const app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.json());

const sequelize = require ('./config/sequelize.js') 

require('dotenv').config()
const port = process.env.port || 3001

const gcRoute = require("./router/gcRoutes")
const stdRoute = require ("./router/stdRoutes")
const facultyRoute = require ("./router/facultyRoutes")

app.use("/gc", gcRoute)
app.use("/std", stdRoute)
app.use("/faculty", facultyRoute)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
})