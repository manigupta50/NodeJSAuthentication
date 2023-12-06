import nodemailer from 'nodemailer';

export async function sendMail(mailType, userEmail, password) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cnsender2@gmail.com',
            pass: 'qrqulwdosrfoimld'
        }
    });

    if(mailType == "OTP") {
        const mailOptions = {
            from: 'cnsender2@gmail.com',
            to: userEmail,
            subject: 'OTP for resetting the password',
            text: 'The OTP is ' + otp
        };

        try {
            const result = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully.");
        } catch(err) {
            console.log('Email send failed: ' + err);
        }
    }

    if(mailType == "WELCOME") {
        const mailOptions = {
            from: 'cnsender2@gmail.com',
            to: userEmail,
            subject: 'Welcome',
            text: 'Thanks for registering with us. You are very welcome here.'
        };

        try {
            const result = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully.");
        } catch(err) {
            console.log('Email send failed: ' + err);
        }
    }

    if(mailType == "PASSWORD-UPDATE") {
        const mailOptions = {
            from: 'cnsender2@gmail.com',
            to: userEmail,
            subject: 'Password Reset',
            text: 'Your password has been reset.'
        };

        try {
            const result = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully.");
        } catch(err) {
            console.log('Email send failed: ' + err);
        }
    }

    if(mailType == "PASSWORD-RESET") {
        const mailOptions = {
            from: 'cnsender2@gmail.com',
            to: userEmail,
            subject: 'Password Reset',
            text: 'Your password has been reset. And the new password is: ' + password + ', We highly recommend to change this password.'
        };

        try {
            const result = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully.");
        } catch(err) {
            console.log('Email send failed: ' + err);
        }
    }
}