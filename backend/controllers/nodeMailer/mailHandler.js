require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmailToPatient = async (patientEmail, userId, password) => {
    try {
        console.log("GMAIL_USER:", process.env.GMAIL_USER);
        console.log("GMAIL_PASS:", process.env.GMAIL_PASS);

        // Create a transporter with your Gmail account details
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Gmail address from .env
                pass: process.env.GMAIL_PASS  // Gmail password or App Password from .env
            }
        });

        // Set up email options with HTML content
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: patientEmail,
            subject: 'Your Medical Record Login Credentials',
            html: `
                <h3>Dear Patient,</h3>
                <p>Here are your login credentials:</p>
                <ul>
                    <li><strong>User ID:</strong> ${userId}</li>
                    <li><strong>Password:</strong> ${password}</li>
                </ul>
                <p>Please keep this information safe and do not share it with others.</p>
                <br>
                <p>Best regards,</p>
                <p>Your Medical Records Team</p>
            `
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// sendEmailToPatient('rahulsreekumar03@gmail.com', "UserId", "password");


module.exports = {sendEmailToPatient};
