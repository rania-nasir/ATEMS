const express = require('express');
const facRouter = express.Router();


facRouter.post('/signIn', (req, res)=>{ res.send('Faculty SignIn'); });
facRouter.get('/supReviewRequest', (req, res)=>{ res.send('Review Supervision Request'); });
facRouter.get('/viewAnnouncement', (req, res)=>{ res.send('Views announcements here'); });

module.exports = facRouter;