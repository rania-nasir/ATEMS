const express = require('express');
const gcRouter = express.Router();
const gcFunctions = require("../controller/gc/gc.controller");
const gcReview = require("../controller/gc/gcReviewRequest.Controller");

gcRouter.get('/viewStudents', gcFunctions.viewStudents);
gcRouter.post('/addStudent', gcFunctions.addStudent);
// gcRouter.put('/updateStudent', (req, res)=>{ res.send('Add student here'); });
// gcRouter.delete('/deleteStudent', (req, res)=>{ res.send('Add student here'); });
gcRouter.post('/addFaculty', gcFunctions.addFaculty);
gcRouter.get('/viewFaculty', gcFunctions.viewFaculty);
// gcRouter.put('/updateFaculty', (req, res)=>{ res.send('Update faculty here'); });
// gcRouter.delete('/deleteFaculty', (req, res)=>{ res.send('Delete faculty here'); });
gcRouter.get('/ReviewRequest', gcReview.getThesis);
gcRouter.get('/ReviewRequest/:thesisId', gcReview.getThesisDetails);
gcRouter.post('/ApproveRequest/:thesisId', gcReview.approveThesis);
// gcRouter.get('/assignRoles', (req, res)=>{ res.send('GC assign faculty roles here'); });
gcRouter.post('/makeAnnouncement', gcFunctions.addAnnouncement);

module.exports = gcRouter;