const express = require('express');
const router = express.Router();
const { sendMail } = require('../config/mailer');
const { faculties } = require('../model/faculty.model');
const { students } = require('../model/student.model');


const forgetPassword = async (req, res) => {
    
    const { id, email } = req.body; 

    let user;
    user = await faculties.findOne({ where: { facultyid: id, email } });

    if (!user) {
        user = await students.findOne({ where: { rollno: id, email } });
    }

    if (!user) {
        return res.status(404).json({ message: 'ID and email combination not found in the system' });
    }


    try {

        await sendMail(email, 'Password Recovery', `Your password for ID: ${id} is: ${user.password}`); // Send the password via email
        return res.status(200).json({ message: 'Password sent successfully' });

    } catch (error) {

        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email' }); 

    }
};

// Route for the forgot password functionality without authentication
router.post('/forgetPassword', forgetPassword);

module.exports = router;