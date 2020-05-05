var express = require('express');
const { check, validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var RequestService = require('../service/requests');
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
async function verifyTokenToGetInfo(token, res, lang) {

    try {
        id = undefined;
        jwt.verify(token, config.secret, function (err, decoded) {
            id = decoded.id;
            return decoded.id;

        });
    } catch (ex) {

    }
}

router.get('/admin/get/:user_id', async function (req, res) {
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
            RequestService.Get(req.params.user_id).then(purchases => {
                resolve(purchases);
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: purchases
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
router.get('/admin/get', async function (req, res) {
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
            RequestService.GetAll().then(purchases => {
                resolve(purchases);
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: purchases
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

router.put('/admin/update', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }
        if (!req.body.request_id || req.body.request_id == '') {
            languageService.get_lang(lang, 'INVALID_REQUEST_ID').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else {
            return new Promise(function (resolve, reject) {
                RequestService.Update(req.body).then(results => {
                    resolve(results);
                    if (results == null) {
                        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: results
                            });
                        });
                    } else {
                        languageService.get_lang(lang, 'SUCCESS').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: results
                            });
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
        })
    }
});

router.delete('/admin/delete/:request_id', async function (req, res) {
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
            RequestService.Delete(req.params.request_id).then(deleted => {
                resolve(deleted);
                if (deleted) {
                    languageService.get_lang(lang, 'SUCCESS').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: deleted
                        });
                    });
                } else {
                    languageService.get_lang(lang, 'SUCCESS').then(msg => {
                        res.json({
                            status: statics.STATUS_SUCCESS,
                            code: codes.SUCCESS,
                            message: msg.message,
                            data: deleted
                        });
                    });
                }
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

router.post('/admin/create', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {

        var credentials = req.body;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await verifyTokenToGetInfo(token, res, lang);


        return new Promise(function (resolve, reject) {


            if (!id && !credentials.first_name || credentials.first_name == '') {
                languageService.get_lang(lang, 'INVALID_FIRST_NAME').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!id && !credentials.last_name || credentials.last_name == '') {
                languageService.get_lang(lang, 'INVALID_LAST_NAME').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!id && !credentials.phone || credentials.phone == '') {
                languageService.get_lang(lang, 'INVALID_PHONE').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else {
                return new Promise(function (resolve, reject) {
                    if (id) {
                        credentials['request_from'] = id;
                    }
                    console.log(credentials)
                    RequestService.Create(credentials).then(purchase => {
                        resolve(purchase);
                        languageService.get_lang(lang, 'SUCCESS').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: purchase
                            });
                        });
                    }
                        ,
                        error => {
                            reject(error);
                            languageService.get_lang(lang, 'FAILED_AUTHENTICATE_TOKEN').then(msg => {
                                res.json({
                                    status: statics.STATUS_FAILURE,
                                    code: codes.TOKEN_INVALID,
                                    message: msg.message,
                                    data: null
                                });
                            });
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
});

module.exports = router;