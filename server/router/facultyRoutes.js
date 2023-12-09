const express = require('express');
const facRouter = express.Router();
const facFunctions = require('../controller/faculty/faculty.controller');
const facReview = require('../controller/faculty/supReviewRequest.controller');
const msrcReview = require('../controller/faculty/msrcReview.controller');
const { authenticate } = require('../middleware/authMiddleware');

facRouter.post('/signIn', facFunctions.facultySignIn);

facRouter.use(authenticate);

// Supervisor Functions
// Fetches the list of requests
facRouter.get('/supAllRequests', facReview.getSynopsis);
// supervisor selects 1 request out of many, fetches the synopsis details
facRouter.get('/supReviewRequest/:synopsisId', facReview.getSynopsisDetails);
// supervisor approves
facRouter.post('/approve-synopsis/:synopsisId', facReview.approveSynopsis);
// supervisor declines
facRouter.post('/decline-synopsis/:synopsisId', facReview.declineSynopsis);

// MSRC Functions
facRouter.get('/msrcAllThesis', msrcReview.getAcceptedThesis);
facRouter.get('/msrcThesisDetails/:thesisId', msrcReview.getThesisDetails);
facRouter.get('/msrcSubmitFeedback/:thesisId', msrcReview.setThesisFeedback);

facRouter.post('/forwardRequest', (req, res) => { res.send('Update announcement here'); });  //forward supervison reuqest to GC
facRouter.post('/addAnnouncement', (req, res) => { res.send('Send announcement here'); });
facRouter.get('/viewAnnouncement', (req, res) => { res.send('Views announcements here'); });
facRouter.get('/msrcReviewRequest', (req, res) => { res.send('Review MSC Request'); });
facRouter.post('/msrcComment', (req, res) => { res.send('Give comments here'); });

module.exports = facRouter;