var express = require('express');
const {check, validationResult} = require('express-validator/check');
var statics = require('../constant/static.js');
var messages = require('../constant/message.js');
var ar_messages = require('../constant/arabic_messages.js');
var codes = require('../constant/code.js');
var authenticationService = require('../service/authentication.js');
var languageService = require('../validator/language');
const multer = require('multer');
var config = require('../constant/config.js');
var bcrypt = require('bcryptjs');
var blacklist = require('express-jwt-blacklist');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '_' + file.originalname);
    }
});
const upload = multer({storage: storage});
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
var router = express.Router();
var email

function verifyToken(token, res, lang) {
    if (!token) {
        languageService.get_lang(lang, 'NO_TOKEN').then(msg => {

            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.TOKEN_MISSING,
                message: msg.message,
                auth: false,
                data: null
            });
        });
        return
    }

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            languageService.get_lang(lang, 'FAILED_AUTHENTICATE_TOKEN').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.TOKEN_INVALID,
                    message: msg.message,
                    data: null
                });
            });
            return
        }
        email = decoded.email;
        return decoded.email;

    });
}


//login
router.post('/login', function (req, res) {

    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var creqentials = req.body;

        if (creqentials.email == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (creqentials.password == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_PASS').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else {
            return new Promise(function (resolve, reject) {
                authenticationService.login(creqentials.email, creqentials.password).then(user => {
                    resolve(user);
                    if (user == null) {
                        languageService.get_lang(lang, 'INCORRECT_PASSWORD_USER').then(msg => {
                            console.log(msg);
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: user
                            });
                        });
                    } else {
                        var userData = {
                            id: user.user_admin_id,
                            password: user.password,
                            email: user.email
                        }
                        var token = jwt.sign(userData, config.secret, {});
                        // authenticationService.login_token(user.user_admin_id);

                        if (user.active == 0) {
                            languageService.get_lang(lang, 'ACTIVATION').then(msg => {
                                res.json({
                                    status: statics.STATUS_FAILURE,
                                    code: codes.ACCOUNT_NOT_FOUND,
                                    message: msg.message,
                                    data: null,
                                    token: token
                                });
                            });
                        } else {
                            user['token'] = token,
                                languageService.get_lang(lang, 'DATA_FOUND').then(msg => {

                                    res.json({
                                        status: statics.STATUS_SUCCESS,
                                        code: codes.SUCCESS,
                                        message: msg.message,
                                        data: user,
                                    });
                                });
                        }
                    }


                }, error => {
                    reject(error);
                });
            });

        }
    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        });
    }
});

//register
router.post('/register', function (req, res) {
        var lang = req.headers.language;
        var errors = validationResult(req);
        if (errors.array().length == 0) {
            var creqentials = req.body;
            var lang = req.headers.language;

            return new Promise(function (resolve, reject) {
                if (creqentials.email == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        })
                    });

                } else if (creqentials.password == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_PASS').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (creqentials.first_name == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_FIRST').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (creqentials.last_name == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_LAST').then(msg => {

                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (creqentials.phone == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_PHONE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else {

                    return new Promise(function (resolve, reject) {

                        authenticationService.check_user(creqentials.email, creqentials.password, creqentials.first_name, creqentials.last_name, creqentials.phone, creqentials.user_type).then(user => {

                                resolve(user);

                                if (user == null) {
                                    languageService.get_lang(lang, 'EMAIL_REGISTERED').then(msg => {

                                        res.json({
                                            status: statics.STATUS_FAILURE,
                                            code: codes.FAILURE,
                                            message: msg.message,
                                            data: null
                                        });
                                    });
                                } else {
                                    var userdata = {
                                        id: user.id,
                                        email: user.email,
                                        password: user.password,

                                    }
                                    var token = jwt.sign(userdata, config.secret, {});
                                    user.token = token;

                                    var transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                            user: 'muhammad.umer9122@gmail.com',
                                            pass: 'Addidas9122334455?'
                                        }
                                    });

                                    const mailOptions = {
                                        from: 'muhammad.umer9122@gmail.com', // sender address
                                        to: user.email, // list of receivers
                                        subject: 'Subject of your email', // Subject line
                                        html: '<p>Your OTP here ' + user.otp + '</p>'// plain text body
                                    };

                                    transporter.sendMail(mailOptions, function (err, info) {
                                        if (err)
                                            console.log(err)
                                        else
                                            console.log(info);
                                    });
                                    languageService.get_lang(lang, 'REGISTEreq_USER').then(msg => {
                                        res.json({
                                            status: statics.STATUS_SUCCESS,
                                            code: codes.SUCCESS,
                                            message: msg.message,
                                            data: user,
                                        });
                                    });
                                }


                            }
                            ,
                            error => {
                                reject(error);
                            }
                        );
                    });


                }
            })
        } else {
            languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.INVALID_DATA,
                    message: msg.message,
                    data: errors.array()
                });
            });

        }
    }
);

//activate
router.put('/activate', function (req, res) {

    var lang = req.headers.language;
    var token = req.headers.authorization;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var otp = req.body;

        if (otp.otp == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_OTP').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else {

            return new Promise(function (resolve, reject) {

                verifyToken(token, res, lang);
                if (email) {
                    authenticationService.check_otp(email, otp.otp).then(user => {

                        resolve(user);

                        if (user == null) {
                            languageService.get_lang(lang, 'INVALID_OTP').then(msg => {
                                res.json({
                                    status: statics.STATUS_FAILURE,
                                    code: codes.FAILURE,
                                    message: msg.message,
                                    data: null
                                });
                            });

                        } else {
                            authenticationService.activate_user(headerdata.token, otp.otp).then(user => {

                                resolve(user);
                                languageService.get_lang(lang, 'ACTIVATED_USER').then(msg => {
                                    res.json({
                                        status: statics.STATUS_SUCCESS,
                                        code: codes.SUCCESS,
                                        message: msg.message,
                                        data: user,
                                    });
                                });

                            }, error => {
                                reject(error);
                            });
                        }


                    }, error => {
                        reject(error);
                    });
                }


            }, error => {
                reject(error);
            });


        }
    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        });

    }
});

// change password
router.put('/change_pass', function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var headerdata = req.headers;
        var data = req.body;

        if (data.password == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_PASS').then(msg => {

                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (data.otp === '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_OTP').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });

        } else {

            return new Promise(function (resolve, reject) {

                authenticationService.check_token(headerdata.token).then(user => {

                    resolve(user);
                    if (user == null) {
                        languageService.get_lang(lang, 'INVALID_TOKEN').then(msg => {

                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });

                    } else {
                        authenticationService.change_pass(headerdata.token, password.password).then(user => {

                            resolve(user);
                            languageService.get_lang(lang, 'CHANGE_PASS').then(msg => {

                                res.json({
                                    status: statics.STATUS_SUCCESS,
                                    code: codes.SUCCESS,
                                    message: msg.message,
                                    data: user,
                                });
                            });

                        }, error => {
                            reject(error);
                        });
                    }


                }, error => {
                    reject(error);
                });


            }, error => {
                reject(error);
            });


        }
    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        });
    }
});

//logout
router.post('/logout', function (req, res) {
    var lang = req.headers.language;
    var token = req.headers.authorization;
    if (!token) {
        languageService.get_lang(lang, 'NO_TOKEN').then(msg => {

            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.TOKEN_MISSING,
                message: msg.message,
                auth: false,
                data: null
            });
        });

    } else {
        blacklist.revoke(token);
        languageService.get_lang(lang, 'LOGOUT_SUCCESS').then(msg => {
            res.json({
                status: statics.STATUS_SUCCESS,
                code: codes.SUCCESS,
                message: msg.message,
                data: null
            });
        });
    }
});

// get profile
router.get('/profile', function (req, res) {
    var lang = req.headers.language;

    var headerdata = req.headers;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        return new Promise(function (resolve, reject) {
            authenticationService.check_token(headerdata.token).then(user => {
                resolve(user);
                if (user == null) {
                    languageService.get_lang(lang, 'INVALID_TOKEN').then(msg => {

                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else {
                    authenticationService.get_user(headerdata.token).then(user => {
                        resolve(user);
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {

                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: user,
                            });
                        });
                    }, error => {
                        reject(error);
                    });
                }
            }, error => {
                reject(error);
            });
        }, error => {
            reject(error);
        });
    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        });
    }
});

// update profile
router.put('/update_profile', upload.single('picture'), function (req, res) {

    var path = req.file.path;
    console.log(path);

    var lang = req.headers.language;


    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var headerdata = req.headers;
        var data = req.body;

        if (data.first_name == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_FIRST').then(msg => {

                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (data.last_name == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_LAST').then(msg => {

                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (data.address == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_ADDRESS').then(msg => {

                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (data.phone == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_PHONE').then(msg => {

                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (data.lattitude == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_LAT').then(msg => {

                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (data.longitude == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_LONG').then(msg => {

                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (data.company_name == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_COMPANY').then(msg => {

                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else {

            return new Promise(function (resolve, reject) {

                authenticationService.check_token(headerdata.authorization).then(user => {


                    resolve(user);
                    if (user == null) {
                        languageService.get_lang(lang, 'INVALID_TOKEN').then(msg => {

                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });

                    } else {
                        authenticationService.update_profile(headerdata.token, data.first_name, data.last_name, data.address, data.phone, path, data.lattitude, data.longitude, data.company_name).then(user => {

                            resolve(user);
                            languageService.get_lang(lang, 'PROFILE_UPDATE').then(msg => {

                                res.json({
                                    status: statics.STATUS_SUCCESS,
                                    code: codes.SUCCESS,
                                    message: msg.message,
                                    data: user,
                                });
                            });

                        }, error => {
                            reject(error);
                        });
                    }


                }, error => {
                    reject(error);
                });


            }, error => {
                reject(error);
            });


        }
    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        });
    }
});

//resend code
router.put('/resend_code', function (req, res) {
    var lang = req.headers.language;

    var errors = validationResult(req);
    if (errors.array().length == 0) {

        return new Promise(function (resolve, reject) {
            verifyToken(req.headers.authorization, res, lang);

            if (email) {
                authenticationService.resend_user(email).then(user => {

                    resolve(user);

                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'muhammad.umer9122@gmail.com',
                            pass: 'Addidas9122334455?'
                        }
                    });

                    const mailOptions = {
                        from: 'muhammad.umer9122@gmail.com', // sender address
                        to: user.email, // list of receivers
                        subject: 'Subject of your email', // Subject line
                        html: '<p>Your OTP here ' + user.otp + '</p>'// plain text body
                    };

                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err)
                            console.log(err)
                        else
                            console.log(info);
                    });

                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        data: user,
                    });

                }, error => {
                    reject(error);
                });


            }


        }, error => {
            reject(error);
        });

    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        });
    }

});

//reset password
router.post('/sent_otp_by_email', function (req, res) {

    var lang = req.headers.language;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var creqentials = req.body;

        if (creqentials.email == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {

                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else {

            return new Promise(function (resolve, reject) {
                authenticationService.check_email(creqentials.email).then(user => {
                    resolve(user);
                    if (!user) {
                        languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {

                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.INVALID_DATA,
                                message: msg.message,
                                data: user
                            });
                        });

                    } else {

                        authenticationService.update_otp(user.email).then(user => {
                            resolve(user);
                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'muhammad.umer9122@gmail.com',
                                    pass: 'Addidas9122334455?'
                                }
                            });

                            const mailOptions = {
                                from: 'muhammad.umer9122@gmail.com', // sender address
                                to: user.email, // list of receivers
                                subject: 'Subject of your email', // Subject line
                                html: '<p>Your code for reset password ' + user.otp + '</p>'// plain text body
                            };

                            transporter.sendMail(mailOptions, function (err, info) {
                                if (err)
                                    console.log(err)
                                else
                                    console.log(info);
                            });
                            languageService.get_lang(lang, 'DATA_FOR_RESET').then(msg => {

                                res.json({
                                    status: statics.STATUS_SUCCESS,
                                    code: codes.SUCCESS,
                                    message: msg.message,
                                    data: user,
                                });
                            });

                        }, error => {
                            reject(error);
                        });


                    }


                }, error => {
                    reject(error);
                });
            });

        }
    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        });

    }
});

// update reset password
router.post('/reset_password', function (req, res) {
    var lang = req.headers.language;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var data = req.body;
        if (data.email == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {

                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        }else if (data.password == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_PASS').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (data.otp == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_OTP').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else {

            return new Promise(function (resolve, reject) {

                authenticationService.update_pass(data.otp, data.password , data.email).then(user => {

                    resolve(user);

                    if (user == null) {
                        languageService.get_lang(lang, 'INVALID_OTP').then(msg => {

                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: user,
                            });
                        });
                    } else {
                        languageService.get_lang(lang, 'CHANGE_PASS').then(msg => {

                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: user,
                            });
                        });
                    }


                }, error => {
                    reject(error);
                });

            }, error => {
                reject(error);
            });


        }
    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        });
    }
});


module.exports = router;