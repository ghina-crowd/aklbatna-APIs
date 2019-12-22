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
                        }

                        if (!user.user_type || user.user_type === 'normal') {
                            userData = {
                                id: user.user_admin_id,
                                password: user.password,
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
                            }
                        }

                        var token = jwt.sign(userData, config.secret, {});

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

//register Social
router.post('/social', function (req, res) {
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

            } else if (creqentials.firstName == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_FIRST').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (creqentials.lastName == '') {
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

                    authenticationService.check_user_social(creqentials.email, '123456789', creqentials.firstName, creqentials.lastName).then(user => {

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
router.post('/register', upload.single('photo'), async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var creqentials = req.body;
        var lang = req.headers.language;

        if (creqentials.user_type == 'servicePro' && creqentials.salesRep_id) {
            var token = req.headers.authorization;
            await verifyToken(token, res, lang);
            if (!id) {
                return;
            }
        }
        return new Promise(function (resolve, reject) {
            if (creqentials.user_type == 'servicePro' && !creqentials.company) {
                languageService.get_lang(lang, 'COMPANY_DETAILS_IS_MISSING').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    })
                });
            }
            else if (!creqentials.user_type && creqentials.user_type == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_USER_TYPE').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    })
                });
            }
            else if (!creqentials.email || creqentials.email == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    })
                });

            } else if (!creqentials.password || creqentials.password == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_PASS').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!creqentials.first_name || creqentials.first_name == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_FIRST').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!creqentials.last_name || creqentials.last_name == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_LAST').then(msg => {

                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!creqentials.phone || creqentials.phone == '') {
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
                    if (!creqentials.password) {
                        temp_password = Math.floor(1000 + Math.random() * 9000) + '';
                        creqentials.password = temp_password;
                    } else {
                        temp_password = creqentials.password;
                    }

                    authenticationService.check_user(creqentials.email, creqentials.password, creqentials.first_name, creqentials.last_name, creqentials.phone, creqentials.user_type, creqentials.salesRep_id).then(user => {
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
                                languageService.get_lang(lang, 'REGISTERED_USER').then(msg => {

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

                                    res.json({
                                        status: statics.STATUS_SUCCESS,
                                        code: codes.SUCCESS,
                                        message: msg.message,
                                        data: tempuser,
                                    });
                                });
                                user.user_type = 'normal';
                                var user_data = {
                                    id: user.user_admin_id,
                                    email: user.email,
                                    password: user.password,
                                }
                                var token = jwt.sign(user_data, config.secret, {});
                                user.token = token;

                                utils.SendEmail(user.email, 'OTP', '<p>Your OTP here ' + user.otp + '</p>');

                            } else if (user.user_type === 'servicePro' && salesRep) {

                                // creating user as service provider when request is from salesRep

                                creqentials.company['user_id'] = user.user_admin_id;
                                console.log(creqentials.company);
                                companyService.create_company(creqentials.company).then(company => {

                                    languageService.get_lang(lang, 'REGISTERED_USER').then(msg => {

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

                                    utils.SendEmail(user.email, 'Coboney', '<p>Hi ' + user.first_name + " " + user.last_name + '</p> Thank you for register with Coboney, our team will verify your account shortly. </p> <p> or visit this <a href= "https://www.coboney.com" target = "_self"> link </a> to see more details.</p>  <p>Email is : <strong> ' + tempuser.email + ' </strong> .</p>      <p>Account password is : <strong> ' + temp_password + ' </strong> .</p> ');


                                }).catch(err => {

                                });


                            } else if (user.user_type === 'servicePro' && !salesRep) {
                                // creating user as service provider when request is from service provider.
                                creqentials.company['user_id'] = user.user_admin_id;
                                console.log(creqentials.company);
                                companyService.create_company(creqentials.company).then(company => {

                                    languageService.get_lang(lang, 'REGISTERED_USER').then(msg => {

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

                                    utils.SendEmail(user.email, 'Coboney', ' <p>Hi ' + user.first_name + " " + user.last_name + '</p> Thank you for register with Coboney, our team will verify your account shortly. </p> <p> or visit this <a href= "https://www.coboney.com" target = "_self"> link </a> to see more details.</p>   <p>Email is : <strong> ' + tempuser.email + ' </strong> .</p>    <p>Account password is : <strong> ' + temp_password + ' </strong> .</p> ');


                                }).catch(err => {

                                });


                            } else if (user.user_type === 'salesRep') {
                                //normal user after
                                var user_data = {
                                    id: user.user_admin_id,
                                    email: user.email,
                                    password: user.password,
                                    salesRep: true
                                }
                                var token = jwt.sign(user_data, config.secret, {});
                                user.token = token;
                                utils.SendEmail(user.email, 'Coboney', ' <p>Hi ' + user.first_name + " " + user.last_name + '</p> <p>Congratulations ... you are now a member of Coboney family. </p> <p>Your Coboney PIN Code is: ' + String(1000 + Number(user.user_admin_id)) + '</p> </br> </br><p>    * You will be asked to enter your Coboney PIN code during the registering of your service providers in <a href = "https://www.coboney.com" target = "_self">Coboney.com;</a> to collect your commission' + ' with each sale of a coupon related to that service provider.</p> <p><a href = "https://www.coboney.com" target = "_self" >My List</a></p>');
                                languageService.get_lang(lang, 'REGISTERED_USER').then(msg => {

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

// update profile
router.put('/update_profile', upload.single('picture'), function (req, res) {

    var path = req.file.path;
    console.log(path);

    var lang = req.headers.language;


    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var header_data = req.headers;
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

                authenticationService.check_token(header_data.authorization).then(user => {


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
                        authenticationService.update_profile(header_data.token, data.first_name, data.last_name, data.address, data.phone, path, data.lattitude, data.longitude, data.company_name).then(user => {

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
        if (data.email || data.email == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {

                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (data.password || data.password == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_PASS').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (data.otp || data.otp == '') {
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