const { sequelize } = require("../../config/sequelize");
const { thesis } = require("../../model/thesis.model");
const { faculties } = require("../../model/faculty.model");
const { students } = require("../../model/student.model");
const { sendMail } = require("../../config/mailer");


const getThesis = async (req, res) => {
    try {
        const allThesis = await thesis.findAll({
            where: {
                hodapproval: 'Pending' // only pending thesis will be fetched
            },
            attributes: ['thesisid', 'rollno', 'facultyid', 'supervisorname', 'thesistitle', 'potentialareas', 'gcapproval'],
        });

        res.json({ allThesis });

    } catch (error) {
        console.error('Error fetching thesis for review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const onethesisDetails = async (req, res) => {
    try {
        // hod will choose an id for review
        const { thesisId } = req.params;
        const facultyId = req.userId;


        const selectedThesis = await thesis.findOne({
            where: {
                thesisid: thesisId
            },
        });


        // Check if the faculty exists and fetch its role
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId
            }
        });

        if (!faculty) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        const facultyRole = faculty.role;

        if (facultyRole.includes('HOD')) {
            // Functionality for HOD
            const selectedThesis = await thesis.findOne({
                where: {
                    thesisid: thesisId
                },
            });

            if (!selectedThesis) {
                return res.status(404).json({ error: 'Thesis not found' });
            }

            const fileURL = `/uploads/${selectedThesis.proposalfilename}`; // Construct the file URL
            selectedThesis.dataValues.fileURL = fileURL; // Add the file URL to the selectedThesis object

            res.json({ selectedThesis });

        } else {
            // If the faculty does not have the role of HOD
            return res.status(403).json({ error: 'Access forbidden. Only HOD can perform this functionality' });
        }

    } catch (error) {

        console.error('Error fetching thesis details:', error);
        res.status(500).json({ error: 'Internal server error' });

    }
};






const hodapproveThesis = async (req, res) => {
    try {
        // hod will choose an id for review
        const { thesisId } = req.params;
        const facultyId = req.userId;

        // Check if the faculty exists and fetch its role
        const faculty = await faculties.findOne({
            where: {
                facultyid: facultyId
            }
        });

        if (!faculty) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        const facultyRole = faculty.role;
        console.log('facultyRole:', facultyRole);

        if (facultyRole.includes('HOD')) {
            const selectedThesis = await thesis.findOne({
                where: {
                    thesisid: thesisId
                },
            });

            if (!selectedThesis) {
                return res.status(404).json({ error: 'Thesis not found' });
            }

            if (selectedThesis.gcapproval !== 'Approved') {
                return res.status(403).json({ message: 'GC approval is required before HOD approval' });
            }

            const [rowsAffected, [updatedThesis]] = await thesis.update(
                {
                    hodapproval: 'Approved',
                },
                {
                    where: {
                        thesisid: thesisId
                    },
                    returning: true,
                }
            );

            if (rowsAffected === 0) {
                return res.status(404).json({ error: 'Thesis not found' });
            }

            const student = await students.findOne({
                where: {
                    rollno: selectedThesis.rollno.toString()
                }
            });

            if (!student) {
                return res.status(404).json({ error: 'Student not found for the given synopsis' });
            }

            const facultyName = faculty.facultyname;
            const toEmail = student.email;
            const subject = 'Thesis Approved';
            const text = `Dear Student,
        
        Your thesis has been approved by Head of Department ${facultyName} (Faculty ID: ${facultyId}).
        Your thesis internal examiners are ${selectedThesis.internal1} and ${selectedThesis.internal2}.
  
        Best of luck for your thesis!
        Regards,`;

            try {
                await sendMail(toEmail, subject, text);
                res.json({ message: 'Thesis approved and email sent to student', updatedThesis });
            } catch (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Error sending approval email' });
            }
        } else {
            return res.status(403).json({ error: 'Access forbidden. Only HOD can approve the thesis' });
        }
    } catch (error) {
        console.error('Error approving thesis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports =
{
    getThesis,
    onethesisDetails,
    hodapproveThesis
}