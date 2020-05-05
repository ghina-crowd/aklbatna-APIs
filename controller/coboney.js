var express = require('express');
const { check, validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var CoboneyService = require('../service/coboney');
const jwt = require('jsonwebtoken');
var config = require('../constant/config.js');
const utils = require('../util/utils');

const values = {
    access_code: "0DOhCpU9sK2ixyhtFQ6p",
    merchant_identifier: "2f3cd163",
    passphrase: "$2y$10$mAEqbb2kZ",
    // command: "PURCHASE",
    // return_url: "http://coboney.com/",
    // purchase_url: 'https://sbcheckout.payfort.com/FortAPI/paymentPage'
}

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
router.get('/:type', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;

        return new Promise(function (resolve, reject) {
            CoboneyService.get(req.params.type).then(contacts => {
                resolve(contacts);
                if (contacts == null) {
                    contacts = {};
                }
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: contacts
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
router.get('/mobile/about/:type', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;

        return new Promise(function (resolve, reject) {
            CoboneyService.getMobile(req.params.type).then(contacts => {
                resolve(contacts);
                if (contacts == null) {
                    contacts = {};
                }
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: contacts
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

router.get('/get/faq', async function (req, res) {
    console.log('faq')
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;

        return new Promise(function (resolve, reject) {
            console.log('faq 12')
            CoboneyService.getFAQ().then(faqs => {
                resolve(faqs);
                if (faqs == null) {
                    faqs = [];
                }
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: faqs
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
router.post('/create', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.body;
        var lang = req.headers.language;

        return new Promise(function (resolve, reject) {
            if (!credentials.arabic || credentials.arabic == '') {
                languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.english || credentials.english == '') {
                languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } {
                return new Promise(function (resolve, reject) {
                    CoboneyService.createContactUs(credentials).then(account => {
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
}
);
router.post('/payment/Signature', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.body;
        var lang = req.headers.language;

        return new Promise(function (resolve, reject) {
            if (!credentials.amount || credentials.amount == '') {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: 'amount',
                    data: null
                });
            } else if (!credentials.merchant_reference || credentials.merchant_reference == '') {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: 'merchant_reference',
                    data: null
                });
            } else if (!credentials.currency || credentials.currency == '') {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: 'currency',
                    data: null
                });
            } else if (!credentials.language || credentials.language == '') {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: 'language',
                    data: null
                });
            } else if (!credentials.customer_email || credentials.customer_email == '') {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: 'customer_email',
                    data: null
                });
            } {
                return new Promise(function (resolve, reject) {

                    console.log(credentials);
                    var object = {};

                    object.language = credentials.language;
                    object.currency = credentials.currency;
                    object.amount = credentials.amount;
                    object.command = credentials.command;
                    object.merchant_reference = credentials.merchant_reference;
                    object.access_code = credentials.access_code;
                    object.customer_email = credentials.customer_email;
                    object.return_url = credentials.return_url;
                    object.merchant_identifier = credentials.merchant_identifier;
                    object.signature = utils.create_signature(values.passphrase, object);
                    
                    languageService.get_lang(lang, 'SUCCESS').then(msg => {
                        res.json({
                            status: statics.STATUS_SUCCESS,
                            code: codes.SUCCESS,
                            message: msg.message,
                            data: object
                        });
                    });

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