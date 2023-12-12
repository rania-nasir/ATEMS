const { sequelize } = require("../../config/sequelize");
const { sendMail } = require("../../config/mailer");
const { students } = require("../../model/student.model");
const { faculties } = require("../../model/faculty.model");
const { synopsis } = require("../../model/synopsis.model");

/*Synopsis Controller*/

// Helper function for sendFaculties.
// Get the list of faculties in the system.
const getFaculties = async () => {
    try {
        // Fetch all faculties
        const allFaculties = await faculties.findAll({
            attributes: ['facultyid', 'name'],
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
        const synopsistitle = req.body.synopsistitle;
        const description = req.body.description;
        const facultyname = req.body.facultyname;
        const studentrollno = req.userId;

        const existingSynopsis = await synopsis.findOne({ // Find an existing synopsis by the student
            where: {
                rollno: studentrollno,
            },
        });

        if (existingSynopsis) {
            return res.status(400).json({ error: 'Request already exists for this roll number' });
        }

        const faculty = await faculties.findOne({
            where: {
                name: facultyname,
            },
            attributes: ['facultyid', 'email'], // fetches id and email of faculty which the student wants to send request to
        });


        if (!faculty) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        const facultyid = faculty.facultyid;


        const newSynopsis = await synopsis.create({ // Creating Synopsis in the table with the following information
            synopsistitle,
            description,
            facultyid: facultyid,
            facultyname: facultyname,
            rollno: studentrollno,
            synopsisstatus: 'Pending',

        });

        // Email sending
        const student = await students.findOne({
            where: {
                rollno: studentrollno,
            },
            attributes: ['name'],
        });
        const studentname = student.name;

        const toEmail = faculty.email;
        const subject = 'New Supervision Request';
        const text = `A student has requested for you supervision. Details are as follows: 
        Roll number: ${studentrollno}
        Student Name: ${studentname}
        Synopsis title: ${synopsistitle}
        
        Visit ATEMS for further action`;

        sendMail(toEmail, subject, text);

        res.status(200).json({ message: 'Synopsis created successfully', synopsis: newSynopsis });


    } catch (error) {
        console.error('Error processing synopsis form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { fillSynopsis, sendFaculties };
