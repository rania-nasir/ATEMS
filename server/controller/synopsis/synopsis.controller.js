const { sequelize } = require("../../config/sequelize");
const { sendMail } = require("../../config/mailer");
const { students } = require("../../model/student.model");
const { faculties } = require("../../model/faculty.model");
const { synopsis } = require("../../model/synopsis.model");
const { Op, Model } = require('sequelize');
const multer = require('multer');
const upload = require('../../middleware/multer');

/*Synopsis Controller*/

// Helper function for sendFaculties.
// Get the list of faculties in the system.
const getFaculties = async () => {
    try {
        // Fetch all faculties
        const allFaculties = await faculties.findAll({
            attributes: ['facultyid', 'name'],
            where: {
                role: { [Op.contains]: ['Supervisor'] }
            }
        });

        return allFaculties;
    } catch (error) {
        console.error('Error fetching faculties:', error);
        throw error;
    }
};

// This function will send the list of faculties registered in the system to the frontend
const sendFaculties = async (req, res) => {
    try {

        const allFaculties = await getFaculties(); // Uses the helper function get all faculties into allFaculties
        res.json({ allFaculties });

    } catch (error) {
        console.error('Error loading synopsis form:', error);
        res.status(500).json({ error: 'Internal server error' }); // error 1 for this function
    }
};


// Moving synopsis data from frontend to backend and creating a synopsis
const fillSynopsis = async (req, res) => {
    try {
        console.log("Pass");

        // Call the multer middleware to handle file upload
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: 'File upload error' });
            } else if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            // Continue processing the form data after the file upload
            const synopsistitle = req.body.synopsistitle;
            const facultyname = req.body.facultyname;
            const studentrollno = req.userId;
            const potentialareas = req.body.potentialareas;
            const proposalfilename = req.file.filename;

            console.log(req.body);

            const existingSynopsis = await synopsis.findOne({ // Find an existing synopsis by the student
                where: {
                    rollno: studentrollno,
                },
            });

            if (existingSynopsis) {
                return res.json({ message: 'You already sent a synopsis request' });
            }

            const faculty = await faculties.findOne({
                where: {
                    name: facultyname,
                    role: { [Op.contains]: ['Supervisor'] },
                },
                attributes: ['facultyid', 'email'], // fetches id and email of faculty which the student wants to send request to
            });

            if (!faculty) {
                return res.json({ message: 'Please Select the Supervisor first' });
            }

            const facultyid = faculty.facultyid;

            // Email sending
            const student = await students.findOne({
                where: {
                    rollno: studentrollno,
                },
                attributes: ['name'],
            });
            const studentname = student.name;


            const newSynopsis = await synopsis.create({ // Creating Synopsis in the table with the following information
                synopsistitle,
                potentialareas,
                facultyid: facultyid,
                facultyname: facultyname,
                rollno: studentrollno,
                stdname: studentname,
                synopsisstatus: 'Pending',
                proposalfilename
            });


            const toEmail = faculty.email;
            const subject = 'New Supervision Request';
            const text = `A student has requested for your supervision. Details are as follows: 
            Roll number: ${studentrollno}
            Student Name: ${studentname}
            Synopsis title: ${synopsistitle}
            
            Visit ATEMS for further action`;

            sendMail(toEmail, subject, text);

            res.status(200).json({ message: 'Synopsis created successfully. Email has been send to your supervisor', synopsis: newSynopsis });

        });

    } catch (error) {
        console.error('Error processing synopsis form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = { fillSynopsis, sendFaculties };
