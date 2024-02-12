const express = require('express');
const facRouter = express.Router();
const gcReview = require ("../controller/gc/gcReviewRequest.controller")
const facFunctions = require('../controller/faculty/faculty.controller');
const facReview = require('../controller/faculty/supReviewRequest.controller');
const msrcReview = require('../controller/faculty/msrcReview.controller');
const hodFunctions = require('../controller/hod/hod.controller')
const { authenticate } = require('../middleware/authMiddleware');
const gcRouter = require('./gcRoutes');


facRouter.post('/signIn', facFunctions.facultySignIn);
facRouter.use(authenticate);
facRouter.get('/showFacData/:facultyid', facFunctions.showFacData);


/* Supervisor Functions */

facRouter.get('/supAllRequests', facReview.getSynopsis); // Fetches the list of requests
facRouter.get('/supReviewRequest/:synopsisId', facReview.getSynopsisDetails); // supervisor selects 1 request out of many, fetches the synopsis details
facRouter.post('/approve-synopsis/:synopsisId', facReview.approveSynopsis); // supervisor approves
facRouter.delete('/decline-synopsis/:synopsisId', facReview.declineSynopsis); // supervisor declines
facRouter.get('/propsaleEvaluationStudents', facReview.allProposalEvalations); 

/* MSRC */

facRouter.get('/msrcAllThesis', msrcReview.getAcceptedThesis); // MSRC fetches the lists of all thesis in accepted state
facRouter.get('/msrcThesisDetails/:thesisId', msrcReview.getThesisDetails); // MSRC fetches details of a single thesis
facRouter.post('/msrcSubmitFeedback/:thesisId', msrcReview.setThesisFeedback); // MSRC provides feedback on a single thesis


/*HOD */
facRouter.get('/viewAllThesis', hodFunctions.getThesis);
facRouter.get('/reviewThesis/:thesisId', hodFunctions.onethesisDetails); // GC fetches details of a single accepted synopsis
facRouter.put('/approveThesis/:thesisId', hodFunctions.hodapproveThesis); // GC approves synopsis which creates thesis


/* Feedback */
facRouter.get('/viewAnnouncement', facFunctions.viewFacultyAnnouncements);

module.exports = facRouter;