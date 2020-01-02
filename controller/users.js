var express = require('express');
const { check, validationResult } = require('express-validator/check');
var format = require('string-format');
var languageService = require('../validator/language');
var logger = require('../util/logger.js');
var statics = require('../constant/static.js');
var messages = require('../constant/message.js');
var codes = require('../constant/code.js');
var fields = require('../constant/field.js');
var UserService = require('../service/users.js');
const jwt = require('jsonwebtoken');
var config = require('../constant/config.js');
var authenticationService = require('../service/authentication.js');
const utils = require('../util/utils');


var router = express.Router();
var email;
var servicePro;
var salesRep;
var id;
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
        salesRep = decoded.salesRep;
        servicePro = decoded.servicePro;
        email = decoded.email;
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
        return decoded.email;

    });
}

router.get('/admin/users/:page', async function (req, res) {


    var lang = req.headers.language;
    var params = req.params;
    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        UserService.GetAllUser(params.page).then(function (result) {
            res.json({ status: statics.STATUS_SUCCESS, code: codes.SUCCESS, message: messages.DATA_FOUND, data: result });
        }, function (error) {
            logger.error(messages.SERVER_ERROR + ' ' + error);
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.FAILURE,
                message: messages.INCORRECT_PASSWORD_USER,
                data: null
            });
        });

    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        })
    }

});

router.get('/admin/users/:page/:user_type', async function (req, res) {

    var lang = req.headers.language;
    var token = req.headers.authorization;
    var params = req.params;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        UserService.GetAllUserByType(params.page, params.user_type).then(function (result) {
            res.json({ status: statics.STATUS_SUCCESS, code: codes.SUCCESS, message: messages.DATA_FOUND, data: result });
        }, function (error) {
            logger.error(messages.SERVER_ERROR + ' ' + error);
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.FAILURE,
                message: messages.INCORRECT_PASSWORD_USER,
                data: error
            });
        });

    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        })
    }






});

router.put('/edit_profile', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.body;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }
        if (email) {
            if (!credentials.first_name || credentials.first_name == '') {
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
                    UserService.Update(credentials.first_name, credentials.last_name, credentials.phone, credentials.email, credentials.subscribe, credentials.old_password, credentials.new_password).then(user => {
                        resolve(user);
                        if (user) {
                            languageService.get_lang(lang, 'SUCCESS').then(msg => {
                                res.json({
                                    status: statics.STATUS_SUCCESS,
                                    code: codes.SUCCESS,
                                    message: msg.message,
                                    data: user
                                });
                            });
                        } else {
                            languageService.get_lang(lang, 'INVALID_PASSWORD').then(msg => {
                                res.json({
                                    status: statics.STATUS_FAILURE,
                                    code: codes.FAILURE,
                                    message: msg.message,
                                    data: user
                                });
                            });
                        }



                    }, error => {
                        reject(error);
                    });
                });

            }
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

}
);
// get profile info
router.get('/profile', async function (req, res) {
    var lang = req.headers.language;
    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }
    if (email) {
        UserService.GetUser(email).then(user => {
            var errors = validationResult(req);
            if (errors.array().length == 0) {
                if (user == null) {
                    languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: user
                        });
                    });
                } else {
                    languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                        res.json({
                            status: statics.STATUS_SUCCESS,
                            code: codes.SUCCESS,
                            message: msg.message,
                            data: user
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
                })
            }

        });
    }
});
// get profile info
router.delete('/delete/:id', async function (req, res) {
    var lang = req.headers.language;
    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }

    UserService.DeleteUser(req.params.id).then(user => {
        var errors = validationResult(req);
        if (errors.array().length == 0) {
            if (user == null) {
                languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: user
                    });
                });
            } else {
                languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: user
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
            })
        }

    });
});
// get profile info
router.get('/details/:id', async function (req, res) {
    var lang = req.headers.language;

    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }

    UserService.GetAllUserData(req.params.id).then(user => {
        var errors = validationResult(req);
        if (errors.array().length == 0) {
            if (user == null) {
                languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: user
                    });
                });
            } else {
                languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: user
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
            })
        }

    });
});
// admin update user account_status
router.put('/admin/account_status', async function (req, res) {
    var lang = req.headers.language;
    var credentials = req.body;
    var errors = validationResult(req);

    if (errors.array().length == 0) {
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        return new Promise(function (resolve, reject) {
            UserService.UpdateAccountStatus(credentials).then(user => {
                resolve(user);
                if (user == null) {
                    languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: user
                        });
                    });
                } else {
                    languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                        res.json({
                            status: statics.STATUS_SUCCESS,
                            code: codes.SUCCESS,
                            message: msg.message,
                            data: user
                        });
                    });
                }

            }, error => {
                reject(error);
            });
        });




    } else {
        res.json({
            status: statics.STATUS_FAILURE,
            code: codes.INVALID_DATA,
            message: messages.INVALID_DATA,
            data: errors.array()
        });
    }
});
// get service provider Full profile
router.get('/servicePro/profile', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }
    if (errors.array().length == 0 && salesRep) {
        return new Promise(function (resolve, reject) {
            UserService.GetUser(email).then(user => {
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
// get profile info
router.delete('/delete/:id', async function (req, res) {
    var lang = req.headers.language;

    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }

    UserService.DeleteUser(req.params.id).then(user => {
        var errors = validationResult(req);
        if (errors.array().length == 0) {
            if (user == null) {
                languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: user
                    });
                });
            } else {
                languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: user
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
            })
        }

    });
});
// get profile info
router.get('/ServicePro/details', async function (req, res) {
    var lang = req.headers.language;

    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }

    UserService.GetAllUserData(id).then(user => {
        var errors = validationResult(req);
        if (errors.array().length == 0) {
            if (user == null) {
                languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: user
                    });
                });
            } else {
                languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: user
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
            })
        }

    });
});
router.put('/admin/update', async function (req, res) {

    var lang = req.headers.language;
    var credentials = req.body;
    var errors = validationResult(req);

    if (errors.array().length == 0) {

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }
        return new Promise(function (resolve, reject) {
            UserService.UpdateUserStatus(credentials).then(user => {
                resolve(user);
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: user
                    });
                });
            }, error => {
                reject(error);
            });
        });




    } else {
        res.json({
            status: statics.STATUS_FAILURE,
            code: codes.INVALID_DATA,
            message: messages.INVALID_DATA,
            data: errors.array()
        });
    }
});
// get activities for by own user
router.get('/user/activities', async function (req, res) {
    var lang = req.headers.language;

    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }

    UserService.getUserActivities(id).then(user => {
        var errors = validationResult(req);
        if (errors.array().length == 0) {
            if (user == null) {
                languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: user
                    });
                });
            } else {
                languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: user
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
            })
        }

    });
});
// get activities for by admin
router.get('/admin/activities/:user_id', async function (req, res) {
    var lang = req.headers.language;

    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }

    UserService.getUserActivities(req.params.user_id).then(user => {
        var errors = validationResult(req);
        if (errors.array().length == 0) {
            if (user == null) {
                languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: user
                    });
                });
            } else {
                languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: user
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
            })
        }

    });
});

// get activities for by admin
router.get('/admin/get_best_seller', async function (req, res) {
    var lang = req.headers.language;
    UserService.getBestSeller().then(users => {
        var errors = validationResult(req);
        if (errors.array().length == 0) {
            if (users == null) {
                languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: users
                    });
                });
            } else {
                languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: users
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
            })
        }

    });
});

//register
router.post('/admin/create', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.body;
        var lang = req.headers.language;

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
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
                        temp_password = Math.floor(1000 + Math.random() * 9000) + '';
                        credentials.password = temp_password;
                    } else {
                        temp_password = credentials.password;
                    }

                    authenticationService.create_user_admin(credentials.email, temp_password, credentials.first_name, credentials.last_name, credentials.phone, credentials.user_type).then(user => {
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

                                utils.SendEmail(user.email, 'OTP', '<p>Your Password is ' + temp_password + '</p>');

                            } else if (user.user_type === 'servicePro' && salesRep) {

                                // creating user as service provider when request is from salesRep

                                credentials.company['user_id'] = user.user_admin_id;
                                console.log(credentials.company);
                                companyService.create_company(credentials.company).then(company => {

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
                                credentials.company['user_id'] = user.user_admin_id;
                                console.log(credentials.company);
                                companyService.create_company(credentials.company).then(company => {

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
                                utils.SendEmail(user.email, 'Coboney', ' <p>Hi ' + user.first_name + " " + user.last_name + '</p> <p>Congratulations ... you are now a member of Coboney family. </p> <p>Your Coboney Password  is: ' + temp_password + '</p>  <p>Your Coboney PIN Code is: ' + String(1000 + Number(user.user_admin_id)) + '</p> </br> </br><p>    * You will be asked to enter your Coboney PIN code during the registering of your service providers in <a href = "https://www.coboney.com" target = "_self">Coboney.com;</a> to collect your commission' + ' with each sale of a coupon related to that service provider.</p> <p><a href = "https://www.coboney.com" target = "_self" >My List</a></p>');
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
module.exports = router;