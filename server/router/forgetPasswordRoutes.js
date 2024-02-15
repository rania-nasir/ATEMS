const express = require('express');
const router = express.Router();
const { sendMail } = require('../config/mailer');
const { faculties } = require('../model/faculty.model');
const { students } = require('../model/student.model');

const forgetPassword = async (req, res) => {
    const { id } = req.body; 
    console.log(id);

    let user;

    user = await faculties.findOne({ where: { facultyid: id } });
    if (user) {
        email = user.email;
    } else {
        user = await students.findOne({ where: { rollno: id } });
        if (user) {
            email = user.email;
        }
    }

    if (!user) {
        return res.status(404).json({ message: 'ID not found in the system' });
    }

    try {
        await sendMail(email, 'Password Recovery', `Your password for ID: ${id} is: ${user.password}`);
        return res.status(200).json({ message: 'Password sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email' }); 
    }
};

// Route for the forgot password functionality without authentication
router.post('/forgetPassword', forgetPassword);

module.exports = router;
