const express = require('express');
const facRouter = express.Router();
const gcReview = require("../controller/gc/gcReviewRequest.controller")
const facFunctions = require('../controller/faculty/faculty.controller');
const facReview = require('../controller/faculty/supReviewRequest.controller');
const msrcReview = require('../controller/faculty/msrcReview.controller');
const hodFunctions = require('../controller/hod/hod.controller')
const examinerFunctions = require('../controller/faculty/examiner.controller');
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
facRouter.get('/supviewPropEvalsStudents', facReview.superisorviewPropEvals);
facRouter.get('/selectedProposal/:rollno', facReview.selectedProposalDetails);
facRouter.post('/evaluateProposal/:rollno', facReview.evaluateProposal);


//Internals
facRouter.get('/internalviewPropEvalsStudents', facReview.interalviewPropEvals);

/* MSRC */

facRouter.get('/msrcAllThesis', msrcReview.getAcceptedThesis); // MSRC fetches the lists of all thesis in accepted state
facRouter.get('/msrcThesisDetails/:thesisId', msrcReview.getThesisDetails); // MSRC fetches details of a single thesis
facRouter.post('/msrcSubmitFeedback/:thesisId', msrcReview.setThesisFeedback); // MSRC provides feedback on a single thesis


/*HOD */
facRouter.get('/viewAllThesis', hodFunctions.getThesis);
facRouter.get('/reviewThesis/:thesisId', hodFunctions.onethesisDetails); // GC fetches details of a single accepted synopsis
facRouter.put('/approveThesis/:thesisId', hodFunctions.hodapproveThesis); // GC approves synopsis which creates thesis

/*Examiners */
/* Mid */
facRouter.get('/supviewExaminableThesis', examinerFunctions.supViewExaminableThesis);
facRouter.get('/internalviewExaminableThesis', examinerFunctions.internalViewExaminableThesis);
facRouter.get('/viewSelectedExaminableThesis/:thesisId', examinerFunctions.getExaminableThesisDetails);
facRouter.put('/evaluateSelectedThesisMid', examinerFunctions.evaluateMid);
/* Final */
facRouter.get('/supviewFinalExaminableThesis', examinerFunctions.supViewFinalExaminableThesis);
facRouter.get('/internalviewFinalExaminableThesis', examinerFunctions.internalViewFinalExaminableThesis);
facRouter.get('/viewSelectedFinalExaminableThesis/:thesisId', examinerFunctions.getFinalExaminableThesisDetails);
facRouter.put('/evaluateSelectedThesisFinal', examinerFunctions.evaluateFinal);


/* Feedback */
facRouter.get('/viewAnnouncement', facFunctions.viewFacultyAnnouncements);

module.exports = facRouter;