var express = require('express');
const { check, validationResult } = require('express-validator/check');
var format = require('string-format');
var languageService = require('../validator/language');
var logger = require('../util/logger.js');
var statics = require('../constant/static.js');
var messages = require('../constant/message.js');
var codes = require('../constant/code.js');
var fields = require('../constant/field.js');
var AccountService = require('../service/accounts.js');
const jwt = require('jsonwebtoken');
var config = require('../constant/config.js');


var router = express.Router();
var id;
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
        id = decoded.id;
        return decoded.id;
    });
}

router.get('/get', function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;
        verifyToken(token, res, lang);
        return new Promise(function (resolve, reject) {
            AccountService.GetAccount(id).then(account => {
                resolve(account);
                if (account == null) {
                    account = [];
                }
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: account
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
router.post('/create', function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var creqentials = req.body;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        verifyToken(token, res, lang);
        return new Promise(function (resolve, reject) {
            creqentials.fk_user_id = id;
            if (!creqentials.owner_name || creqentials.owner_name == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_OWNER_NAME').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!creqentials.cvc || creqentials.cvc == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_CVC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!creqentials.expiry_date || creqentials.expiry_date == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_EXPIRY_DATE').then(msg => {

                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!creqentials.card_number || creqentials.card_number == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_CARD_NUMBER').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!creqentials.type || creqentials.type == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_CARD_TYPE').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else {

                return new Promise(function (resolve, reject) {
                    AccountService.Create(creqentials).then(account => {
                        resolve(account);

                        if (account.fk_user_id === creqentials.fk_user_id) {
                            languageService.get_lang(lang, 'SUCCESS').then(msg => {
                                res.json({
                                    status: statics.STATUS_FAILURE,
                                    code: codes.FAILURE,
                                    message: msg.message,
                                    data: account
                                });
                            });
                        } else {
                            languageService.get_lang(lang, 'FAILED').then(msg => {
                                res.json({
                                    status: statics.STATUS_FAILURE,
                                    code: codes.FAILURE,
                                    message: msg.message,
                                    data: account
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
router.put('/update', function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var creqentials = req.body;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        verifyToken(token, res, lang);
        return new Promise(function (resolve, reject) {
            creqentials.fk_user_id = id;
            if (!creqentials.pk_account_id || creqentials.pk_account_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_ACCOUNT_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    })
                });

            } else if (!creqentials.owner_name || creqentials.owner_name == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_OWNER_NAME').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!creqentials.cvc || creqentials.cvc == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_CVC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!creqentials.expiry_date || creqentials.expiry_date == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_EXPIRY_DATE').then(msg => {

                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!creqentials.card_number || creqentials.card_number == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_CARD_NUMBER').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!creqentials.type || creqentials.type == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_CARD_TYPE').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else {
                return new Promise(function (resolve, reject) {
                    AccountService.Update(creqentials).then(account => {
                        resolve(account);
                        languageService.get_lang(lang, 'SUCCESS').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: account
                            });
                        });

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
router.delete('/delete', function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var creqentials = req.body;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        verifyToken(token, res, lang);
        return new Promise(function (resolve, reject) {
            if (!creqentials.pk_account_id || creqentials.pk_account_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_ACCOUNT_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    })
                });

            } else {

                return new Promise(function (resolve, reject) {
                    AccountService.Delete(creqentials).then(account => {
                        resolve(account);
                        languageService.get_lang(lang, 'SUCCESS').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: account
                            });
                        });
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