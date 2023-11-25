const express = require("express");
const stdRouter = express.Router();
const stdFunctions = require("../controller/student.controller");
const synopsisController = require("../controller/synopsis.controller");

stdRouter.post('/signIn', stdFunctions.stdSignIn);

// Render the synopsis form with faculties
stdRouter.get("/synopsisForm", synopsisController.sendFaculties);

// Process the filled synopsis form
stdRouter.post("/fillSynopsis", synopsisController.fillSynopsis);

stdRouter.get("/viewAnnouncement", (req, res) => { res.send("Student views announcements here") });
stdRouter.get("/viewFeedback", (req, res) => { res.send("Student views feedback here") });

module.exports = stdRouter;