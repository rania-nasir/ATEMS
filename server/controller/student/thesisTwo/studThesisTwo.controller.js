const sequelize = require("../../../config/sequelize");
const multer = require("multer");
const thesisTwoReportMiddleware = require("../../../middleware/multerTwo");
const { registrations } = require("../../../model/thesistwo/registration.model");

const uploadThesisTwoReport = async (req, res) => {
    try {
        thesisTwoReportMiddleware.uploadThesisTwoReport(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error during file upload
                console.error('Multer error:', err);
                return res.status(400).json({ error: 'File upload error' });
            } else if (err) {
                // An unknown error occurred
                console.error('Unknown error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            const rollNumber = req.userId;
            if (rollNumber && req.file) {
                const fileName = req.file.originalname; // Get the original file name
                const expectedFileName = rollNumber + '.pdf'; // Generate the expected file name
                if (fileName !== expectedFileName) {
                    // File name does not match roll number
                    return res.status(400).json({ error: 'File name should be the same as your roll number' });
                }
                // Update the registration record with the uploaded file name
                await registrations.update(
                    { thesistwofilename: fileName },
                    { where: { rollno: rollNumber } }
                );
                res.status(200).json({ message: 'Thesis two report uploaded successfully' });
            } else {
                return res.status(400).json({ error: 'Roll number is required or file is missing' });
            }
        });
    } catch (error) {
        console.error('Error uploading thesis two report:', error);
        res.status(500).json({ error: 'An error occurred while uploading thesis two report' });
    }
};

module.exports = {
    uploadThesisTwoReport
};
