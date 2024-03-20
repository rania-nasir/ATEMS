const express = require("express");
const stdRouter = express.Router();
const stdFunctions = require("../controller/student/student.controller");
const synopsisController = require("../controller/synopsis/synopsis.controller");
const thesistwoController = require("../controller/synopsis/thesistwo.controller")
const { authenticate } = require('../middleware/authMiddleware');
const { synopsis } = require("../model/synopsis.model");

stdRouter.post('/signIn', stdFunctions.stdSignIn);
stdRouter.use(authenticate);

stdRouter.get('/showStdData/:rollno', stdFunctions.showStdData);
stdRouter.get('/thesisData/:rollno', stdFunctions.thesisData); 
/* Student Functions */

stdRouter.get("/synopsisForm", synopsisController.sendFaculties); // Render the synopsis form with faculties
stdRouter.post("/fillSynopsis", synopsisController.fillSynopsis); // Process the filled synopsis form
stdRouter.get("/viewAnnouncement", stdFunctions.viewStudentAnnouncements); // Student views Announcements
stdRouter.get("/viewFeedback", stdFunctions.viewFeedback); // Student views Feedback


stdRouter.post("/thesisTwoRegistration", thesistwoController.thesisTwoRegistration);

module.exports = stdRouter;