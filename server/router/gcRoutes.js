const express = require('express');
const multer = require('multer');
const gcRouter = express.Router();
const gcFunctions = require("../controller/gc/gc.controller");
const gcReview = require("../controller/gc/gcReviewRequest.controller")
const { authenticate } = require('../middleware/authMiddleware');
const upload = multer({ dest: 'uploads/' });
const uploadMiddleware = upload.single('file');


gcRouter.post('/signIn', gcFunctions.GCSignIn);
gcRouter.use(authenticate);


/* GC Functions */
gcRouter.get('/showgcData/:gcid', gcFunctions.showgcData);
gcRouter.post('/uploadStdData', uploadMiddleware, gcFunctions.uploadStdData.uploadStd); // GC uploads student data
gcRouter.post('/uploadFacData', uploadMiddleware, gcFunctions.uploadFacData.uploadFac); // GC uploads faculty data


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



gcRouter.put('/updateStudent/:rollno', gcFunctions.updateStudent); // GC updates student
gcRouter.put('/updateFaculty/:facultyid', gcFunctions.updateFaculty); // GC updates faculty

gcRouter.delete('/deleteStudent/:rollno', gcFunctions.deleteStudent);// GC deletes student
gcRouter.delete('/deleteFaculty/:facultyid', gcFunctions.deleteFaculty);// GC deletes faculty

gcRouter.put('/grantPropEvalPermission', gcReview.grantPropEvalPermission);
gcRouter.put('/revokePropEvalPermission', gcReview.revokePropEvalPermission);
gcRouter.put('/grantMidEvalPermission', gcReview.grantMidEvalPermission);
gcRouter.put('/revokeMidEvalPermission', gcReview.revokeMidEvalPermission);
gcRouter.put('/grantFinalEvalPermission', gcReview.grantFinalEvalPermission);
gcRouter.put('/revokeFinalEvalPermission', gcReview.revokeFinalEvalPermission);
gcRouter.get('/proposalEvaluationStatus', gcReview.getGCProposalPermissionStatus);
gcRouter.get('/midEvaluationStatus', gcReview.gcMidPermissionStatus);
gcRouter.get('/finalEvaluationStatus', gcReview.gcFinalPermissionStatus);

gcRouter.get('/gcViewPendingProposals', gcReview.gcAllPendingProposals);
gcRouter.get('/viewPendingProposal/:rollno', gcReview.gcSelectedProposalDetails);
gcRouter.put('/approveProposalComments/:rollno', gcReview.gcApproveProposal);
gcRouter.put('/rejectProposalComments/:rollno', gcReview.gcRejectProposal);

gcRouter.get('/gcViewPendingMids', gcReview.gcAllPendingMidEvaluations);
gcRouter.get('/viewPendingMid/:rollno', gcReview.gcSelectedMidEvaluationDetails);
gcRouter.put('/approveMidComments/:rollno', gcReview.gcApproveMidEvaluation);

gcRouter.get('/gcViewPendingFinals', gcReview.gcAllPendingFinalEvaluations);
gcRouter.get('/viewPendingFinal/:rollno', gcReview.gcSelectedFinalEvaluationDetails);
gcRouter.put('/approveFinalComments/:rollno', gcReview.gcApproveFinalEvaluation);

gcRouter.get('/allSupervisors', gcFunctions.allSupervisors);
gcRouter.get('/allThesisofSupervisor/:supervisorName', gcFunctions.allThesisofSupervisor);
gcRouter.get('/thesisDetails/:thesistitle', gcFunctions.thesisDetails);


module.exports = gcRouter;