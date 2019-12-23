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

router.get('/users', function (request, res) {
    var countries = UserService.GetAllUser();
    countries.then(function (result) {
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
});

router.post('/create', [
    check([fields.NAME]).isLength({
        min: statics.DEFAULT_MIN_CHARACTER_LENGTH,
        max: statics.DEFAULT_CHARATER_LENGTH
    }).withMessage(format(messages.INVALID_LENGTH, [fields.NAME], statics.DEFAULT_MIN_CHARACTER_LENGTH, statics.DEFAULT_CHARATER_LENGTH)),
    check([fields.SHORT_NAME]).isLength({
        min: statics.DEFAULT_MIN_CHARACTER_LENGTH,
        max: statics.DEFAULT_CHARATER_LENGTH
    }).withMessage(format(messages.INVALID_LENGTH, [fields.SHORT_NAME], statics.DEFAULT_MIN_CHARACTER_LENGTH, statics.DEFAULT_CHARATER_LENGTH)),
    check([fields.MOBILE_CODE]).isLength({
        min: statics.DEFAULT_MIN_CHARACTER_LENGTH,
        max: 4
    }).withMessage(format(messages.INVALID_LENGTH, [fields.MOBILE_CODE], statics.DEFAULT_MIN_CHARACTER_LENGTH, 4))
], function (req, res) {
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        UserService.Create(req.body).then(function (result) {
            res.json({ status: statics.STATUS_SUCCESS, code: codes.SUCCESS, message: messages.DATA_SAVED, data: null });
        }, function (error) {
            logger.error(messages.SERVER_ERROR + ' ' + error)
            res.json({
                status: statics.STATUS_SUCCESS,
                code: codes.SUCCESS,
                message: messages.DATA_NOT_SAVED,
                data: null
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
// admin update user user_type
router.put('/admin/user_type', async function (req, res) {

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
            UserService.UpdateUserType(credentials).then(user => {
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
router.put('/admin/user_type', async function (req, res) {

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
router.get('/get_best_seller', async function (req, res) {
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

module.exports = router;