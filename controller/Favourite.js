var express = require('express');
const { validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var FavouriteService = require('../service/Favourite');
const jwt = require('jsonwebtoken');
var config = require('../constant/config.js');


var router = express.Router();
var id;
async function verifyToken(token, res, lang) {
    id = undefined;
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
        return decoded.id;
    });
}
router.get('/get', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }
        return new Promise(function (resolve, reject) {
            FavouriteService.get(id).then(meals => {
                resolve(meals);
                if (meals == null) {
                    meals = [];
                }
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: meals
                    });
                });
            }, error => {
                reject(error);
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


router.post('/status', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }
    try {
        if (errors.array().length == 0) {
            var credentials = req.body;
            var lang = req.headers.language;

            return new Promise(function (resolve, reject) {

                if (!credentials.meal_id || credentials.meal_id == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_MEAL_ID',
                        data: null
                    });
                } else {
                    credentials['user_id'] = id;
                    return new Promise(function (resolve, reject) {
                        FavouriteService.create(credentials).then(account => {
                            resolve(account);
                            languageService.get_lang(lang, 'SUCCESS').then(msg => {
                                res.json({
                                    status: statics.STATUS_SUCCESS,
                                    code: codes.SUCCESS,
                                    message: msg.message,
                                    data: account
                                });
                            });
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
    } catch (ex) {
        console.log(ex);
    }
}
);


router.post('/create', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }
    try {
        if (errors.array().length == 0) {
            var credentials = req.body;
            var lang = req.headers.language;

            return new Promise(function (resolve, reject) {

                if (!credentials.meal_id || credentials.meal_id == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_MEAL_ID',
                        data: null
                    });
                } else {
                    credentials['user_id'] = id;
                    return new Promise(function (resolve, reject) {
                        FavouriteService.create(credentials).then(account => {
                            resolve(account);
                            languageService.get_lang(lang, 'SUCCESS').then(msg => {
                                res.json({
                                    status: statics.STATUS_SUCCESS,
                                    code: codes.SUCCESS,
                                    message: msg.message,
                                    data: account
                                });
                            });
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
    } catch (ex) {
        console.log(ex);
    }
}
);
router.delete('/delete/:favourite_id', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }
        return new Promise(function (resolve, reject) {
            {
                return new Promise(function (resolve, reject) {
                    FavouriteService.delete(req.params.favourite_id).then(account => {
                        resolve(account);

                        if (account) {
                            languageService.get_lang(lang, 'SUCCESS').then(msg => {
                                res.json({
                                    status: statics.STATUS_SUCCESS,
                                    code: codes.SUCCESS,
                                    message: msg.message,
                                    data: account
                                });
                            });
                        } else {
                            languageService.get_lang(lang, 'INVALID_ACCOUNT_ID').then(msg => {
                                res.json({
                                    status: statics.STATUS_FAILURE,
                                    code: codes.FAILURE,
                                    message: msg.message,
                                    data: null
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
module.exports = router;