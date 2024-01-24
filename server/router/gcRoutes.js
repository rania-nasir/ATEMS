const express = require('express');
const gcRouter = express.Router();
const gcFunctions = require("../controller/gc/gc.controller");
const gcReview = require ("../controller/gc/gcReviewRequest.controller")
const { authenticate } = require('../middleware/authMiddleware');

gcRouter.post('/signIn', gcFunctions.GCSignIn);

gcRouter.use(authenticate);

/* GC Functions */


gcRouter.post('/addStudent', gcFunctions.addStudent); // GC adds student
gcRouter.post('/addFaculty', gcFunctions.addFaculty); // GC adds faculty

gcRouter.get('/viewFaculty', gcFunctions.viewFaculty); // GC views faculty
gcRouter.get('/viewStudents', gcFunctions.viewStudents); // GC views student record

gcRouter.get('/ReviewRequest', gcReview.getThesis); // GC fetches all accepted synopsis
gcRouter.get('/ReviewRequest/:thesisId', gcReview.getThesisDetails); // GC fetches details of a single accepted synopsis

gcRouter.post('/ApproveRequest/:thesisId', gcReview.approveThesis); // GC approves synopsis which creates thesis


gcRouter.post('/makeAnnouncement', gcFunctions.addAnnouncement); // GC makes announcement
gcRouter.get('/viewAllThesis', gcReview.viewAllThesis); // GC makes announcement

// gcRouter.get('/assignRoles', (req, res)=>{ res.send('GC assign faculty roles here'); });

gcRouter.put('/updateStudent', gcFunctions.updateStudent); // GC updates student
gcRouter.put('/updateFaculty', gcFunctions.updateFaculty); // GC updates faculty
 
gcRouter.delete('/deleteStudent', gcFunctions.deleteStudent);// GC deletes student
gcRouter.delete('/deleteFaculty', gcFunctions.deleteFaculty);// GC deletes faculty


module.exports = gcRouter;