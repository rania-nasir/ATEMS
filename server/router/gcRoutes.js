const express = require('express');
const gcRouter = express.Router();
const gcFunctions = require("../controller/gc.controller");

//gcRouter.get('/viewStudent', (req, res)=>{ res.send('Display student here'); });
gcRouter.post('/addStudent', gcFunctions.addStudent);
// gcRouter.put('/updateStudent', (req, res)=>{ res.send('Add student here'); });
// gcRouter.delete('/deleteStudent', (req, res)=>{ res.send('Add student here'); });
// gcRouter.get('/viewFaculty', (req, res)=>{ res.send('View faculty here'); });
// gcRouter.post('/addFaculty', (req, res)=>{ res.send('Add faculty here'); });
// gcRouter.put('/updateFaculty', (req, res)=>{ res.send('Update faculty here'); });
// gcRouter.delete('/deleteFaculty', (req, res)=>{ res.send('Delete faculty here'); });
// gcRouter.get('/gcReviewRequest', (req, res)=>{ res.send('All requests to GC'); });
// gcRouter.get('/assignRoles', (req, res)=>{ res.send('GC assign faculty roles here'); });
// gcRouter.post('/makeAnnouncement', (req, res)=>{ res.send('GC make announcements here'); });

module.exports = gcRouter;