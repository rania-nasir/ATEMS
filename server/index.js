const express = require('express')
const app = express()

const sequelize = require ('./config/sequelize.js') 

require('dotenv').config()
const port = process.env.port || 3001

app.use("/", (req, res)=>{
    res.send("ATEMS Server")
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
})