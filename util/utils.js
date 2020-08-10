

const nodemailer = require('nodemailer');
var Mailgen = require('mailgen');

var utils = {
    SendEmail(to, subject, message) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crowdmarketofficial@gmail.com',
                pass: 'CrowdMuhammad'
            }
        });
        const mailOptions = {
            from: 'ALKBETNA', // sender address
            to: to, // list of receivers
            subject: subject,
            html: message
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    },
    SendEmails(to, subject, message) {
        console.log(to)
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crowdmarketofficial@gmail.com',
                pass: 'CrowdMuhammad'
            }
        });
        const mailOptions = {
            from: 'ALKBETNA', // sender address
            to: to, // list of receivers
            subject: subject,
            html: message
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    }, SendEmailsForOrders(to, subject, messageHtml, messageTEXT) {
        console.log(to)
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crowdmarketofficial@gmail.com',
                pass: 'CrowdMuhammad'
            }
        });
        const mailOptions = {
            from: 'ALKBETNA', // sender address
            to: to, // list of receivers
            subject: subject,
            html: messageHtml,
            text: messageTEXT
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    },
    sendOTPEmail(username, emailSent, otp) {



        // Prepare email contents
        var email = {
            body: {
                name: username,
                intro: 'Your OTP for Alkabetna <b>' + otp + '</b>',
            }
        };






        var mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                // Appears in header & footer of e-mails
                name: 'Alkabetna',
                link: 'https://Alkabetna.com/',
                // Optional logo
                logo: 'http://195.229.192.170:3100/images/logo.png'
            }
        });


        // Generate an HTML email with the provided contents
        var emailBody = mailGenerator.generate(email);

        // Generate the plaintext version of the e-mail (for clients that do not support HTML)
        var emailText = mailGenerator.generatePlaintext(email);

        utils.SendEmailsForOrders(emailSent, 'Alkabetna', emailBody, emailText);
    },
    sendPasswordEmail(username, emailSent, password) {

        // Prepare email contents
        var email = {
            body: {
                name: username,
                intro: 'your account created successfully <br/> <b>' + 'Password' + ":  " + password + '</b>',
                action: {
                    instructions: 'Click here to login into dashbord',
                    button: {
                        color: '#3869D4',
                        text: 'Dashboard',
                        link: 'https://Alkabetna.com/login/'
                    }
                },
            }
        };


        var mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                // Appears in header & footer of e-mails
                name: 'Alkabetna',
                link: 'https://Alkabetna.com/',
                // Optional logo
                logo: 'http://195.229.192.170:3100/images/logo.png'
            }
        });


        // Generate an HTML email with the provided contents
        var emailBody = mailGenerator.generate(email);

        // Generate the plaintext version of the e-mail (for clients that do not support HTML)
        var emailText = mailGenerator.generatePlaintext(email);

        utils.SendEmailsForOrders(emailSent, 'Alkabetna', emailBody, emailText);
    },
    sendOTPEmailForgetPassword(username, emailSent, otp) {



        // Prepare email contents
        var email = {
            body: {
                name: username,
                intro: otp,
            }
        };






        var mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                // Appears in header & footer of e-mails
                name: 'Alkabetna',
                link: 'https://Alkabetna.com/',
                // Optional logo
                logo: 'http://195.229.192.170:3100/images/logo.png'
            }
        });


        // Generate an HTML email with the provided contents
        var emailBody = mailGenerator.generate(email);

        // Generate the plaintext version of the e-mail (for clients that do not support HTML)
        var emailText = mailGenerator.generatePlaintext(email);

        utils.SendEmailsForOrders(emailSent, 'Alkabetna', emailBody, emailText);
    },

};
module.exports = utils;