var express = require('express');
const { check, validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var ContactService = require('../service/contactus');
const jwt = require('jsonwebtoken');
var config = require('../constant/config.js');
const utils = require('../util/utils');


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
            ContactService.getAllContactUs().then(contacts => {
                resolve(contacts);
                if (contacts == null) {
                    contacts = [];
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
router.post('/create', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.body;
        var lang = req.headers.language;

        return new Promise(function (resolve, reject) {

            if (!credentials.name || credentials.name == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_NAME').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.email || credentials.email == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {
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
            } else if (!credentials.message || credentials.message == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_MESSAGE').then(msg => {
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
                        credentials.message = id;
                    }
                    ContactService.createContactUs(credentials).then(contacts => {


                        if (contacts != null) {
                            var subject = '_Inquiry';
                            if (Number(contacts.subject) === 1) {
                                subject = '_Complain';
                            }
                            if (Number(contacts.subject) === 2) {
                                subject = '_Support';
                            }

                            utils.SendEmail(contacts.email, 'Cobobey', "<p style=\"font-weight: 400; text-align: center;\">It was our pleasure to hear from you<\/p>\r\n<p style=\"font-weight: 400; text-align: center;\">We have received your concerns, and will get back to you very soon<\/p>\r\n<p style=\"font-weight: 400; text-align: center;\">Thank you&hellip;<\/p>\r\n<p style=\"font-weight: 400; text-align: center;\">&nbsp;<\/p>\r\n<p style=\"font-weight: 400; text-align: center;\">&nbsp;<\/p>\r\n<p style=\"font-weight: 400; text-align: center;\">\u0634\u0643\u0631\u0627\u064B \u0644\u0627\u062A\u0635\u0627\u0644\u0643 \u0628\u062E\u062F\u0645\u0629 \u0639\u0645\u0644\u0627\u0621 \u0643\u0648\u0628\u0648\u0646\u064A<\/p>\r\n<p style=\"font-weight: 400; text-align: center;\">\u0644\u0642\u062F \u062A\u0644\u0642\u064A\u0646\u0627&nbsp;\u0627\u0647\u062A\u0645\u0627\u0645\u062A\u0643&nbsp;\u0648\u0627\u0633\u062A\u0641\u0633\u0627\u0631\u0627\u062A\u0643\u060C \u0648\u0633\u0648\u0641 \u0646\u064F\u0639\u0627\u0648\u062F \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0643 \u0642\u0631\u064A\u0628\u064B\u0627<\/p>\r\n<p style=\"font-weight: 400; text-align: center;\">\u0634\u0643\u0631\u0627 \u0644\u0643&hellip;<\/p>");
                            utils.SendEmail(config.adminemail, 'Coboney', '<p><strong>Name<\/strong>: ' + contacts.name + '<br \/><strong>Email<\/strong>: ' + contacts.email + '<br \/><strong>Phone<\/strong>: ' + contacts.phone + '<br \/><strong>Subject<\/strong>: ' + subject + '<br \/><strong>Message<\/strong>:' + contacts.message + '<br \/><strong>User_type<\/strong>: ' + contacts.user_type + '<\/p>');

                        }
                        resolve(contacts);
                        languageService.get_lang(lang, 'SUCCESS').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: contacts
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
router.put('/update', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.body;
        var lang = req.headers.language;

        return new Promise(function (resolve, reject) {

            if (!credentials.contact_id || credentials.contact_id == '') {
                languageService.get_lang(lang, 'CONTACT_ID_MESSING').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.name || credentials.name == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_NAME').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.email || credentials.email == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {
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
            } else if (!credentials.message || credentials.message == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_MESSAGE').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else {
                return new Promise(function (resolve, reject) {
                    ContactService.update(credentials).then(contacts => {
                        resolve(contacts);
                        languageService.get_lang(lang, 'SUCCESS').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: contacts
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
router.delete('/admin/delete/:contact_id', async function (req, res) {
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
            if (!req.params.contact_id || req.params.contact_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_CONTACT_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    })
                });

            } else {

                return new Promise(function (resolve, reject) {
                    ContactService.Delete(req.params.contact_id).then(account => {
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