const nodemailer = require('nodemailer');

// Create a transporter using SMTP or other transport options
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'projectatems@gmail.com',
        pass: 'rjfuqsszdwqihvwq',
    },
});

// Send mail function
const sendMail = async (to, subject, text) => {
    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'projectatems@gmail.com',
            to,
            subject,
            text,
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendMail };
