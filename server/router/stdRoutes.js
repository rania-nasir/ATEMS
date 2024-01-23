const express = require("express");
const stdRouter = express.Router();
const stdFunctions = require("../controller/student/student.controller");
const synopsisController = require("../controller/synopsis/synopsis.controller");
const { authenticate } = require('../middleware/authMiddleware');

stdRouter.post('/signIn', stdFunctions.stdSignIn);
stdRouter.use(authenticate);

stdRouter.get('/showStdData/:rollno', stdFunctions.showStdData);
/* Student Functions */

stdRouter.get("/synopsisForm", synopsisController.sendFaculties); // Render the synopsis form with faculties
stdRouter.post("/fillSynopsis", synopsisController.fillSynopsis); // Process the filled synopsis form
stdRouter.get("/viewAnnouncement", stdFunctions.viewStudentAnnouncements); // Student views Announcements
stdRouter.get("/viewFeedback", stdFunctions.viewFeedback); // Student views Feedback

module.exports = stdRouter;