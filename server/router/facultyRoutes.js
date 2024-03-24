const express = require('express');
const facRouter = express.Router();
const gcReview = require("../controller/gc/gcReviewRequest.controller")
const facFunctions = require('../controller/faculty/faculty.controller');
const facReview = require('../controller/faculty/supReviewRequest.controller');
const msrcReview = require('../controller/faculty/msrcReview.controller');
const hodFunctions = require('../controller/hod/hod.controller')
const examinerFunctions = require('../controller/faculty/examiner.controller');
const thesis2supervisor = require('../controller/faculty/thesisTwo/supervisor.controller');
const hodThesisTwo = require('../controller/hod/thesisTwo/hodThesisTwo.controller');
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
facRouter.get('/supViewPendingTitleRequests', facReview.getTitleChangeRequests);
facRouter.get('/supViewPendingTitleDetails/:rollno', facReview.getTitleChangeDetails);
facRouter.post('/supApprovePendingTitleRequests/:rollno', facReview.ApproveTitleChangeSupervisor);
facRouter.post('/supRejectPendingTitleRequests/:rollno', facReview.RejectTitleChangeSupervisor);



//Internals
facRouter.get('/internalviewPropEvalsStudents', facReview.interalviewPropEvals);

/* MSRC */

facRouter.get('/msrcAllThesis', msrcReview.getAcceptedThesis); // MSRC fetches the lists of all thesis in accepted state
facRouter.get('/msrcThesisDetails/:thesisId', msrcReview.getThesisDetails); // MSRC fetches details of a single thesis
facRouter.post('/msrcSubmitFeedback/:thesisId', msrcReview.setThesisFeedback); // MSRC provides feedback on a single thesis
facRouter.get('/msrcViewPendingTitleRequests', msrcReview.getTitleChangeRequests);
facRouter.get('/msrcViewPendingTitleDetails/:rollno', msrcReview.getTitleChangeDetails);
facRouter.post('/msrcApprovePendingTitleRequests/:rollno', msrcReview.ApproveTitleChangeMSRC);
facRouter.post('/msrcRejectPendingTitleRequests/:rollno', msrcReview.RejectTitleChangeMSRC);
facRouter.get('/msrcViewPendingSupervisorRequests', msrcReview.getSupervisorChangeRequests);
facRouter.get('/msrcViewPendingSupervisorDetails/:rollno', msrcReview.getSupervisorChangeDetails);
facRouter.post('/msrcApprovePendingSupervisorChange/:rollno', msrcReview.approveSupervisorChangeMSRC);
facRouter.post('/msrcRejectPendingSupervisorChange/:rollno', msrcReview.rejectSupervisorChangeMSRC);

/*HOD */
facRouter.get('/viewAllThesis', hodFunctions.getThesis);
facRouter.get('/reviewThesis/:thesisId', hodFunctions.onethesisDetails); // GC fetches details of a single accepted synopsis
facRouter.put('/approveThesis/:thesisId', hodFunctions.hodapproveThesis); // GC approves synopsis which creates thesis
facRouter.get('/hodViewPendingSupervisorRequests', hodFunctions.getSupervisorChangeRequests);
facRouter.get('/hodViewPendingSupervisorDetails/:rollno', hodFunctions.getSupervisorChangeDetails);
facRouter.post('/hodApprovePendingSupervisorChange/:rollno', hodFunctions.approveSupervisorChangeMSRC);
facRouter.post('/hodRejectPendingSupervisorChange/:rollno', hodFunctions.rejectSupervisorChangeMSRC);

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



/* Thesis-2 */

//---Supervisor---
facRouter.get('/getThesis2Students', thesis2supervisor.getThesis2Students);
facRouter.get('/getThesis2StudentDetails/:rollno', thesis2supervisor.getThesis2StudentDetails);
facRouter.put('/approveThesis2Request/:rollno', thesis2supervisor.approveThesis2Request);
facRouter.get('/supthesis2AllMidEvals', thesis2supervisor.supthesis2AllMidEvals);
facRouter.get('/internalthesis2AllMidEvals', thesis2supervisor.internalthesis2AllMidEvals);
facRouter.get('/mid2EvalDetails/:rollno', thesis2supervisor.mid2EvalDetails);
facRouter.put('/evaluateMid2', thesis2supervisor.evaluateMid2);


//---HOD---
facRouter.get('/getHodThesis2Students', hodThesisTwo.getHodThesis2Students);
facRouter.get('/getHodThesis2StudentDetails/:rollno', hodThesisTwo.getHodThesis2StudentDetails);
facRouter.put('/approveHodThesis2Request/:rollno', hodThesisTwo.approveHodThesis2Request);


module.exports = facRouter;