const express = require('express');
const multer = require('multer');
const gcRouter = express.Router();
const gcFunctions = require("../controller/gc/gc.controller");
const gcReview = require ("../controller/gc/gcReviewRequest.controller")
const { authenticate } = require('../middleware/authMiddleware');
const upload = multer({ dest: 'uploads/' });
const uploadMiddleware = upload.single('file');


gcRouter.post('/signIn', gcFunctions.GCSignIn);
gcRouter.use(authenticate);


/* GC Functions */
gcRouter.get('/showgcData/:gcid', gcFunctions.showgcData);
gcRouter.post('/uploadStdData',uploadMiddleware ,gcFunctions.uploadStdData.uploadStd); // GC uploads student data
gcRouter.post('/uploadFacData',uploadMiddleware ,gcFunctions.uploadFacData.uploadFac); // GC uploads faculty data

//gcRouter.post('/addStudent', gcFunctions.addStudent); // GC adds student
//gcRouter.post('/addFaculty', gcFunctions.addFaculty); // GC adds faculty

gcRouter.get('/viewFaculty', gcFunctions.viewFaculty); // GC views faculty
gcRouter.get('/viewStudents', gcFunctions.viewStudents); // GC views student record


gcRouter.get('/viewFaculty/:facultyid', gcFunctions.viewSelectedFaculty);
gcRouter.get('/viewStudent/:rollno', gcFunctions.viewSelectedStudent);


gcRouter.get('/ReviewRequest', gcReview.getThesis); // GC fetches all accepted synopsis
gcRouter.get('/ReviewRequest/:thesisId', gcReview.getThesisDetails); // GC fetches details of a single accepted synopsis

gcRouter.post('/ApproveRequest/:thesisId', gcReview.approveThesis); // GC approves synopsis which creates thesis


gcRouter.post('/panelTime', gcFunctions.panelTime); // GC updates panel time

gcRouter.post('/makeAnnouncement', gcFunctions.addAnnouncement); // GC makes announcement
gcRouter.get('/viewAllThesis', gcReview.viewAllThesis); 

// gcRouter.get('/assignRoles', (req, res)=>{ res.send('GC assign faculty roles here'); });

gcRouter.put('/updateStudent/:rollno', gcFunctions.updateStudent); // GC updates student
gcRouter.put('/updateFaculty/:facultyid', gcFunctions.updateFaculty); // GC updates faculty
 
gcRouter.delete('/deleteStudent/:rollno', gcFunctions.deleteStudent);// GC deletes student
gcRouter.delete('/deleteFaculty/:facultyid', gcFunctions.deleteFaculty);// GC deletes faculty


module.exports = gcRouter;