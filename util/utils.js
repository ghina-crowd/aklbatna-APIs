

const nodemailer = require('nodemailer');
var utils = {
    SendEmail(to, subject, message) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'acoponey@gmail.com',
                pass: 'muhammadcrowd'
            }
        });
        const mailOptions = {
            from: 'Coboney <coboney@admin.com>', // sender address
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
    }
};
module.exports = utils;