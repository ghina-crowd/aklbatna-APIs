var express = require('express');
const { validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var logger = require('../util/logger.js');
var statics = require('../constant/static.js');
var messages = require('../constant/message.js');
var codes = require('../constant/code.js');
var UserService = require('../service/users.js');
const jwt = require('jsonwebtoken');
var config = require('../constant/config.js');
var authenticationService = require('../service/authentication.js');
const utils = require('../util/utils');


var router = express.Router();
var email;
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
router.post('/admin/get', async function (req, res) {


    var lang = req.headers.language;
    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        UserService.GetAllUser(req.body).then(function (result) {
            res.json({ status: statics.STATUS_SUCCESS, code: codes.SUCCESS, message: messages.DATA_FOUND, data: result });
        }, function (error) {
            logger.error(messages.SERVER_ERROR + ' ' + error);
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.FAILURE,
                message: messages.INVALID_DATA,
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
        console.log(credentials);
        if (email) {
            if (!credentials.first_name || credentials.first_name == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_FIRST').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    }); 123123
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
            } else {
                return new Promise(function (resolve, reject) {
                    UserService.Update(credentials.first_name, credentials.last_name, credentials.phone, credentials.email, credentials.newsletter, credentials.old_password, credentials.new_password, credentials.profile, credentials.fcm).then(user => {
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
router.put('/fcm', async function (req, res) {
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
        console.log(credentials);
        if (email) {
            {
                return new Promise(function (resolve, reject) {
                    UserService.UpdateFCM(credentials.fcm, email).then(user => {
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
router.put('/admin/Kitchen/ApproveOrReject/:user_id/:active', async function (req, res) {
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
            credentials.user_id = req.params.user_id;
            credentials.active = req.params.active;
            UserService.blockOrUnblock(credentials).then(user => {
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

                    if (user.user_type === 'servicePro') {
                        utils.SendEmail(user.email, 'Verification', ' <p>Hello ' + user.first_name + '' + user.last_name + '</p> . </p> <p>Your account is successfully verified by admin please visit this <a href= "' + config.adminurl + '" target = "_self"> link </a> to see more details.</p>   ');
                    }

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
            if (!credentials.user_type && credentials.user_type == '') {
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
            } else if (!credentials.active || credentials.active == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_ACTIVE').then(msg => {
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

                    if (credentials.user_type !== 'normal') {
                        if (!credentials.password) {
                            temp_password = Math.floor(1000 + Math.random() * 90000000) + '';
                            credentials.password = temp_password;
                        } else {
                            temp_password = credentials.password;
                        }
                    }

                    authenticationService.create_user_admin(credentials.email, temp_password, credentials.first_name, credentials.last_name, credentials.phone, credentials.user_type, credentials.active, credentials.profile).then(user => {
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
                                        user_id: user.user_id,
                                        email: user.email,
                                        first_name: user.first_name,
                                        last_name: user.last_name,
                                        phone: user.phone,
                                        user_type: user.user_type,
                                    }

                                    res.json({
                                        status: statics.STATUS_SUCCESS,
                                        code: codes.SUCCESS,
                                        message: msg.message,
                                        data: tempuser,
                                    });
                                });
                                console.log(user.first_name + " " + user.last_name);
                                console.log(user.email);
                                console.log(user.otp);

                                utils.sendOTPEmail(user.first_name + " " + user.last_name, user.email, user.otp);

                            } else {

                                // creating user as service provider when request is from salesRep

                                languageService.get_lang(lang, 'ACTIVATED_USER').then(msg => {

                                    var tempuser = {
                                        user_id: user.user_id,
                                        email: user.email,
                                        first_name: user.first_name,
                                        last_name: user.last_name,
                                        phone: user.phone,
                                        user_type: user.user_type,
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
                                    id: user.user_id,
                                    email: user.email,
                                    password: user.password,
                                    servicePro: true
                                }
                                var token = jwt.sign(user_data, config.secret, {});
                                user.token = token;

                                utils.sendPasswordEmail(user.first_name + " " + user.last_name, user.email, temp_password);





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