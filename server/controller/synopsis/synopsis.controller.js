const { sequelize } = require("../../config/sequelize");
const { sendMail } = require("../../config/mailer");
const { students } = require("../../model/student.model");
const { faculties } = require("../../model/faculty.model");
const { synopsis } = require("../../model/synopsis.model");

/*Synopsis Controller*/

// get the list of faculties in the system
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
        console.log('Passed');
        const allFaculties = await getFaculties();
        console.log('Passed 1');
        res.json({ allFaculties });

        // res.render('synopisForm', {
        //     allFaculties,
        // });

    } catch (error) {
        console.error('Error loading synopsis form:', error);
        res.status(500).json({ error: 'Internal server error 1' }); // error 1 for this function
    }
};

const fillSynopsis = async (req, res) => {
    try {
        const synopsistitle = req.body.synopsistitle;
        const description = req.body.description;
        const facultyname = req.body.facultyname;
        const studentrollno = req.userId;

        // console.log('------> ', synopsistitle, description, facultyname, '<--');

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


        const newSynopsis = await synopsis.create({
            synopsistitle,
            description,
            facultyid: facultyid,
            facultyname: facultyname,
            rollno: studentrollno, //dummy for testing // should be student roll no after authentication
            synopsisstatus: 'Pending',

        });

        // Email sending

        //console.log("Faculty email : ", faculty.email);

        const toEmail = faculty.email;
        const subject = 'New Supervision Request';
        const text = 'This is a test email sent using Nodemailer.';

        sendMail(toEmail, subject, text);

        res.status(200).json({ message: 'Synopsis created successfully', synopsis: newSynopsis });


    } catch (error) {
        console.error('Error processing synopsis form:', error);
        res.status(500).json({ error: 'Internal server error 2' }); // error 2 for this function
    }
}

module.exports = { fillSynopsis, sendFaculties };
