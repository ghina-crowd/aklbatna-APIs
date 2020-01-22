var express = require('express');
const { validationResult } = require('express-validator/check');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var authenticationService = require('../service/authentication.js');
var companyService = require('../service/company');
var languageService = require('../validator/language');
const multer = require('multer');
const jwt = require('jsonwebtoken');
var config = require('../constant/config.js');
var blacklist = require('express-jwt-blacklist');
const nodemailer = require('nodemailer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + '_' + file.originalname);
    }
});

const upload = multer({ storage: storage });
const utils = require('../util/utils');
var router = express.Router();
var email;
var id;
var servicePro;
var salesRep;

async function verifyToken(token, res, lang) {
    id = undefined;
    if (!token) {
        languageService.get_lang(lang, 'NO_TOKEN').then(msg => {
            res.send({
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
                res.send({
                    status: statics.STATUS_FAILURE,
                    code: codes.TOKEN_INVALID,
                    message: msg.message,
                    data: null
                });
            });
            return
        }
        id = decoded.id;
        if (!id) {
            languageService.get_lang(lang, 'FAILED_AUTHENTICATE_TOKEN').then(msg => {
                res.send({
                    status: statics.STATUS_FAILURE,
                    code: codes.TOKEN_MISSING,
                    message: msg.message,
                    auth: false,
                    data: null
                });
            });
            return
        }
        salesRep = decoded.salesRep;;
        servicePro = decoded.servicePro;;
        email = decoded.email;
        return decoded.id;
    });
}



//login
router.post('/login', function (req, res) {

    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.body;

        if (!credentials.email || credentials.email == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (!credentials.password || credentials.password == '') {
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
                authenticationService.login(credentials.email, credentials.password).then(user => {
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
                        }

                        if (!user.user_type || user.user_type === 'normal') {
                            userData = {
                                id: user.user_admin_id,
                                password: user.password,
                                email: user.email,
                                email: user.email,
                            }
                        } else if (user.user_type === 'servicePro') {
                            userData = {
                                id: user.user_admin_id,
                                password: user.password,
                                email: user.email,
                                servicePro: true
                            }
                        }
                        else if (user.user_type === 'salesRep') {
                            userData = {
                                id: user.user_admin_id,
                                password: user.password,
                                email: user.email,
                                salesRep: true
                            }
                        } else {
                            userData = {
                                id: user.user_admin_id,
                                password: user.password,
                                email: user.email,
                                admin: true
                            }
                        }

                        var token = jwt.sign(userData, config.secret, {});

                        if (user.active == 0) {
                            var userTemp = { token: token };

                            if (user.user_type === 'servicePro') {
                                languageService.get_lang(lang, 'ACTIVATION').then(msg => {
                                    res.json({
                                        status: statics.STATUS_FAILURE,
                                        code: codes.ACCOUNT_NOT_ACTIVE,
                                        message: msg.message,
                                        data: userTemp,
                                        token: token
                                    });
                                });
                            } else {
                                languageService.get_lang(lang, 'ACTIVATION').then(msg => {
                                    res.json({
                                        status: statics.STATUS_FAILURE,
                                        code: codes.ACCOUNT_NOT_FOUND,
                                        message: msg.message,
                                        data: userTemp,
                                        token: token
                                    });
                                });
                            }

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

//register Social
router.post('/social', function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.body;
        var lang = req.headers.language;

        return new Promise(function (resolve, reject) {
            if (credentials.email == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    })
                });

            } else if (credentials.firstName == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_FIRST').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (credentials.lastName == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_LAST').then(msg => {

                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else {

                return new Promise(function (resolve, reject) {

                    authenticationService.check_user_social(credentials.email, '123456789', credentials.firstName, credentials.lastName).then(user => {

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

                            languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                                console.log(user);
                                var tempuser = {
                                    user_admin_id: user.user_admin_id,
                                    email: user.email,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    token: user.token,
                                }

                                res.json({
                                    status: statics.STATUS_SUCCESS,
                                    code: codes.SUCCESS,
                                    message: msg.message,
                                    data: tempuser,
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

//register
router.post('/register'
    , upload.array('images')
    , async function (req, res) {
        var lang = req.headers.language;
        var errors = validationResult(req);
        if (errors.array().length == 0) {
            var credentials = req.body;
            var lang = req.headers.language;

            if (credentials.user_type == 'servicePro' && credentials.salesRep_id) {
                var token = req.headers.authorization;
                await verifyToken(token, res, lang);
                if (!id) {
                    return;
                }
            }
            return new Promise(function (resolve, reject) {
                if (credentials.user_type == 'servicePro' && !credentials.company) {
                    languageService.get_lang(lang, 'COMPANY_DETAILS_IS_MISSING').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        })
                    });
                }
                else if (!credentials.user_type && credentials.user_type == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_USER_TYPE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        })
                    });
                }
                else if (!credentials.email || credentials.email == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        })
                    });

                } else if (!credentials.salesRep_id && !credentials.password) {
                    console.log('in')
                    languageService.get_lang(lang, 'EMPTY_FIELD_PASS').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (!credentials.first_name || credentials.first_name == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_FIRST').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (!credentials.last_name || credentials.last_name == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_LAST').then(msg => {

                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (!credentials.phone || credentials.phone == '') {
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
                        // checking if user has no password means this request is from Sales Representative for service provider account.
                        var temp_password = ""
                        if (!credentials.password) {
                            temp_password = Math.floor(1000 + Math.random() * 90000000) + '';
                            credentials.password = temp_password;
                        } else {
                            temp_password = credentials.password;
                        }

                        authenticationService.check_user(credentials.email, credentials.password, credentials.first_name, credentials.last_name, credentials.phone, credentials.user_type, credentials.salesRep_id).then(user => {
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

                                if (!user.user_type || user.user_type === 'normal') {
                                    //normal user after
                                    var tempuser = {
                                        user_admin_id: user.user_admin_id,
                                        email: user.email,
                                        first_name: user.first_name,
                                        last_name: user.last_name,
                                        phone: user.phone,
                                        user_type: user.user_type,
                                        photo: user.photo,
                                        token: user.token,
                                    }

                                    tempuser.user_type = 'normal';
                                    var user_data = {
                                        id: user.user_admin_id,
                                        email: user.email,
                                        password: user.password,
                                    }
                                    var token = jwt.sign(user_data, config.secret, {});
                                    tempuser.token = token;

                                    languageService.get_lang(lang, 'REGISTERED_USER').then(msg => {

                                        res.json({
                                            status: statics.STATUS_SUCCESS,
                                            code: codes.SUCCESS,
                                            message: msg.message,
                                            data: tempuser,
                                        });
                                    });

                                    utils.SendEmail(user.email, 'OTP', '<p>Your OTP here ' + user.otp + '</p>');

                                } else if (user.user_type === 'servicePro' && salesRep) {

                                    // creating user as service provider when request is from salesRep

                                    credentials.company['user_id'] = user.user_admin_id;
                                    companyService.create_company(credentials.company).then(company => {

                                        var tempuser = {
                                            user_admin_id: user.user_admin_id,
                                            email: user.email,
                                            first_name: user.first_name,
                                            last_name: user.last_name,
                                            phone: user.phone,
                                            user_type: user.user_type,
                                            photo: user.photo,
                                            token: user.token,
                                            company: company
                                        }
                                        languageService.get_lang(lang, 'REGISTERED_USER').then(msg => {

                                            res.json({
                                                status: statics.STATUS_SUCCESS,
                                                code: codes.SUCCESS,
                                                message: msg.message,
                                                data: tempuser,
                                            });
                                        });


                                        //normal user after
                                        var user_data = {
                                            id: user.user_admin_id,
                                            email: user.email,
                                            password: user.password,
                                            servicePro: true
                                        }
                                        var token = jwt.sign(user_data, config.secret, {});
                                        user.token = token;

                                        utils.SendEmail(user.email, 'Coboney', '<p>Hi ' + user.first_name + " " + user.last_name + '</p> Thank you for register with Coboney, our team will verify your account shortly. </p> <p> or visit this <a href= "' + config.adminurl + '" target = "_self"> link </a> to see more details.</p>  <p>Email is : <strong> ' + tempuser.email + ' </strong> .</p>      <p>Account password is : <strong> ' + temp_password + ' </strong> .</p> ');
                                        utils.SendEmail(config.adminemail, 'Coboney', ' <p>Hello Admin</p> . </p> <p> New Services provider has been regsiter into your platform please visit this <a href= "' + config.adminurl + 'pages/service_provider/' + user.user_admin_id + '" target = "_self"> link </a> to see more details.</p>   ');


                                    }).catch(err => {
                                        console.log('error in register service provider');
                                        console.log(err)
                                    });


                                } else if (user.user_type === 'servicePro' && !salesRep) {
                                    // creating user as service provider when request is from service provider.
                                    credentials.company['user_id'] = user.user_admin_id;
                                    console.log(credentials.company);
                                    companyService.create_company(credentials.company).then(company => {
                                        var tempuser = {
                                            user_admin_id: user.user_admin_id,
                                            email: user.email,
                                            first_name: user.first_name,
                                            last_name: user.last_name,
                                            phone: user.phone,
                                            user_type: user.user_type,
                                            photo: user.photo,
                                            token: user.token,
                                            company: company
                                        }
                                        languageService.get_lang(lang, 'REGISTERED_USER').then(msg => {



                                            res.json({
                                                status: statics.STATUS_SUCCESS,
                                                code: codes.SUCCESS,
                                                message: msg.message,
                                                data: tempuser,
                                            });
                                        });



                                        //normal user after
                                        var user_data = {
                                            id: user.user_admin_id,
                                            email: user.email,
                                            password: user.password,
                                            servicePro: true
                                        }
                                        var token = jwt.sign(user_data, config.secret, {});
                                        user.token = token;

                                        utils.SendEmail(user.email, 'Coboney', ' <p>Hi ' + user.first_name + " " + user.last_name + '</p> Thank you for register with Coboney, our team will verify your account shortly. </p> <p> or visit this <a href= "' + config.adminurl + '" target = "_self"> link </a> to see more details.</p>   <p>Email is : <strong> ' + tempuser.email + ' </strong> .</p>    <p>Account password is : <strong> ' + temp_password + ' </strong> .</p> ');
                                        utils.SendEmail(config.adminemail, 'Coboney', ' <p>Hello Admin</p> . </p> <p> New Services provider has been regsiter into your platform please visit this <a href= "' + config.adminurl + 'pages/service_provider/' + user.user_admin_id + '" target = "_self"> link </a> to see more details.</p>   ');


                                    }).catch(err => {

                                    });


                                } else if (user.user_type === 'salesRep') {

                                    utils.SendEmail(user.email, 'Coboney', ' <p>Hi ' + user.first_name + " " + user.last_name + '</p> <p>Congratulations ... you are now a member of Coboney family. </p> <p>Your Coboney PIN Code is: ' + String(1000 + Number(user.user_admin_id)) + '</p> </br> </br><p>    * You will be asked to enter your Coboney PIN code during the registering of your service providers in <a href = "https://www.coboney.com" target = "_self">Coboney.com;</a> to collect your commission' + ' with each sale of a coupon related to that service provider.</p> <p><a href = "https://www.coboney.com" target = "_self" >My List</a></p>');
                                    var tempuser = {
                                        user_admin_id: user.user_admin_id,
                                        email: user.email,
                                        first_name: user.first_name,
                                        last_name: user.last_name,
                                        phone: user.phone,
                                        user_type: user.user_type,
                                        photo: user.photo,
                                        token: user.token,
                                        code: String(1000 + Number(user.user_admin_id))
                                    }
                                    //normal user after
                                    var user_data = {
                                        id: user.user_admin_id,
                                        email: user.email,
                                        password: user.password,
                                        salesRep: true
                                    }
                                    var token = jwt.sign(user_data, config.secret, {});
                                    user.token = token;
                                    languageService.get_lang(lang, 'REGISTERED_USER').then(msg => {

                                        res.json({
                                            status: statics.STATUS_SUCCESS,
                                            code: codes.SUCCESS,
                                            message: msg.message,
                                            data: tempuser,
                                        });
                                    });
                                }
                            }
                        },
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
router.put('/activate', async function (req, res) {

    var lang = req.headers.language;
    var token = req.headers.authorization;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var otp = req.body;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

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
                            authenticationService.activate_user(id, otp.otp).then(user => {
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
                authenticationService.check_token(header_data.token).then(user => {

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
                        authenticationService.change_pass(header_data.token, password.password).then(user => {

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
router.post('/logout', async function (req, res) {
    var lang = req.headers.language;
    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }
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
        jwt.blacklist(token);
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
            authenticationService.check_token(header_data.token).then(user => {
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
                    authenticationService.get_user(header_data.token).then(user => {
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

//resend code
router.put('/resend_code', async function (req, res) {
    var lang = req.headers.language;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        return new Promise(function (resolve, reject) {
            if (email) {
                authenticationService.resend_user(email).then(user => {

                    resolve(user);
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'acoponey@gmail.com',
                            pass: 'muhammadcrowd'
                        }
                    });

                    const mailOptions = {
                        from: 'acoponey@gmail.com', // sender address
                        to: user.email, // list of receivers
                        subject: 'Coponey', // Subject line
                        html: '<p>Your OTP here ' + user.otp + '</p>'// plain text body
                    };

                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err)
                            console.log(err)
                        else
                            console.log(info);
                    });

                    delete user.otp;

                    languageService.get_lang(lang, 'PLEASE_CHECK_YOUR_EMAIL').then(msg => {
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
        var credentials = req.body;

        if (credentials.email == '') {
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
                authenticationService.check_email(credentials.email).then(user => {
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
                                    user: 'acoponey@gmail.com',
                                    pass: 'muhammadcrowd'
                                }
                            });

                            const mailOptions = {
                                from: 'acoponey@gmail.com', // sender address
                                to: user.email, // list of receivers
                                subject: 'Coponey', // Subject line
                                html: '<p>Your code for reset password ' + user.otp + '</p>'// plain text body
                            };

                            transporter.sendMail(mailOptions, function (err, info) {
                                if (err)
                                    console.log(err)
                                else
                                    console.log(info);
                            });

                            delete user.otp;

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
        if (!data.email || data.email == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {

                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (!data.password || data.password == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_PASS').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (!nodedata.otp || data.otp == '') {
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

                authenticationService.update_pass(data.otp, data.password, data.email).then(user => {

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


// get profile
router.get('/checktoken', function (req, res) {
    var lang = req.headers.language;
    var token = req.headers.authorization;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                languageService.get_lang(lang, 'FAILED_AUTHENTICATE_TOKEN').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.TOKEN_INVALID,
                        message: msg.message,
                    });
                });
                return
            } else {
                languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                    });
                });
            }
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


module.exports = router;