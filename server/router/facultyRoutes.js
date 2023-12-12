const express = require('express');
const facRouter = express.Router();
const facFunctions = require('../controller/faculty/faculty.controller');
const facReview = require('../controller/faculty/supReviewRequest.controller');
const msrcReview = require('../controller/faculty/msrcReview.controller');
const { authenticate } = require('../middleware/authMiddleware');

facRouter.post('/signIn', facFunctions.facultySignIn);

facRouter.use(authenticate);

/* Supervisor Functions */

facRouter.get('/supAllRequests', facReview.getSynopsis); // Fetches the list of requests
facRouter.get('/supReviewRequest/:synopsisId', facReview.getSynopsisDetails); // supervisor selects 1 request out of many, fetches the synopsis details
facRouter.post('/approve-synopsis/:synopsisId', facReview.approveSynopsis); // supervisor approves
facRouter.delete('/decline-synopsis/:synopsisId', facReview.declineSynopsis); // supervisor declines

/* MSRC */

facRouter.get('/msrcAllThesis', msrcReview.getAcceptedThesis); // MSRC fetches the lists of all thesis in accepted state
facRouter.get('/msrcThesisDetails/:thesisId', msrcReview.getThesisDetails); // MSRC fetches details of a single thesis
facRouter.post('/msrcSubmitFeedback/:thesisId', msrcReview.setThesisFeedback); // MSRC provides feedback on a single thesis

/* Feedback */
facRouter.get('/viewAnnouncement', facFunctions.viewFacultyAnnouncements);

module.exports = facRouter;