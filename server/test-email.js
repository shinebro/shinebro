const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('Testing email configuration...');
    console.log('User:', process.env.GMAIL_USER ? 'Set' : 'Not Set');
    console.log('Pass:', process.env.GMAIL_PASS ? 'Set' : 'Not Set');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER, // Send to self
        subject: 'Test Email from ShineBro Debugger',
        text: 'If you receive this, email sending is working correctly!'
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        console.log('Response:', info.response);
    } catch (error) {
        console.error('Error sending email:');
        console.error(error);
    }
}

testEmail();
