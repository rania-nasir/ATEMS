const express = require("express");
const stdRouter = express.Router();
const stdFunctions = require("../controller/student/student.controller");
const synopsisController = require("../controller/synopsis/synopsis.controller");
const { authenticate } = require('../middleware/authMiddleware');

stdRouter.post('/signIn', stdFunctions.stdSignIn);

stdRouter.use(authenticate);
// Render the synopsis form with faculties
stdRouter.get("/synopsisForm", synopsisController.sendFaculties);

// Process the filled synopsis form
stdRouter.post("/fillSynopsis", synopsisController.fillSynopsis);

stdRouter.get("/viewAnnouncement", stdFunctions.viewStudentAnnouncements);
stdRouter.get("/viewFeedback", (req, res) => { res.send("Student views feedback here") });

module.exports = stdRouter;