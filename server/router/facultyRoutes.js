const express = require('express');
const facRouter = express.Router();
const facFunctions = require('../controller/faculty/faculty.controller');
const facReview = require('../controller/faculty/supReviewRequest.controller');

facRouter.post('/signIn', facFunctions.facultySignIn);
// Fetches the list of requests
facRouter.get('/supAllRequests', facReview.getSynopsis);
// supervisor selects 1 request out of many, fetches the synopsis details
facRouter.get('/supReviewRequest/:synopsisid', facReview.getSynopsisDetails);
// supervisor approves
facRouter.post('/approve-synopsis/:synopsisId', facReview.approveSynopsis);
// supervisor declines
facRouter.post('/decline-synopsis/:synopsisId', facReview.declineSynopsis);
// supervisor adds internals
facRouter.post('/select-internal-members/:synopsisId', facReview.selectInternalMembers);

facRouter.post('/forwardRequest', (req, res) => { res.send('Update announcement here'); });  //forward supervison reuqest to GC
facRouter.post('/addAnnouncement', (req, res) => { res.send('Send announcement here'); });
facRouter.get('/viewAnnouncement', (req, res) => { res.send('Views announcements here'); });
facRouter.get('/msrcReviewRequest', (req, res) => { res.send('Review MSC Request'); });
facRouter.post('/msrcComment', (req, res) => { res.send('Give comments here'); });

module.exports = facRouter;