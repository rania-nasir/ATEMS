const express = require("express");
const stdRouter = express.Router();


stdRouter.post("/signIn", (req, res)=>{ res.send("Student Sigin")});
stdRouter.post("/fillSynopsis", (req, res)=>{ res.send("Stdent Fill synopsis")});
stdRouter.get("/viewAnnouncement", (req, res)=>{ res.send("Student views announcements here")});
stdRouter.get("/viewFeedback", (req, res)=>{ res.send("Student views feedback here")});


module.exports = stdRouter;