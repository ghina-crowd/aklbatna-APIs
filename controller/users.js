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
function verifyToken(token, res, lang) {
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
router.put('/edit_profile', function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.body;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        verifyToken(token, res, lang);
        if (email) {
            // var email = 'acoponey@gmail.com';
            if (credentials.first_name == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_FIRST').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (credentials.last_name == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_LAST').then(msg => {

                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (credentials.phone == '') {
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

                    UserService.Update(credentials.first_name, credentials.last_name, credentials.phone, credentials.email).then(user => {

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
router.get('/profile', function (req, res) {
    var lang = req.headers.language;
    var token = req.headers.authorization;
    console.log(lang);
    verifyToken(token, res, lang);
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
})

// get profile info
router.delete('/delete/:id', function (req, res) {
    var lang = req.headers.language;
    var token = req.headers.authorization;

    verifyToken(token, res, lang);

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
})


// get profile info
router.get('/details/:id', function (req, res) {
    var lang = req.headers.language;
    var token = req.headers.authorization;

    verifyToken(token, res, lang);

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
})

router.put('/admin/user_type', function (req, res) {
    var lang = req.headers.language;
    var token = req.headers.authorization;
    var credentials = req.body;
    var errors = validationResult(req);

    if (errors.array().length == 0) {
        verifyToken(token, res, lang);




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
})


module.exports = router;