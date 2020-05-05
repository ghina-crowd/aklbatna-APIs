var express = require('express');
const { validationResult } = require('express-validator/check');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var ContactServices = require('../service/Contact')
var languageService = require('../validator/language');
var config = require('../constant/config.js');


const jwt = require('jsonwebtoken');
var router = express.Router();
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
router.get('/admin/get/:page', function (req, res) {

    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        return new Promise(function (resolve, reject) {
            ContactServices.getAll(req.params.page).then(categories => {
                resolve(categories);
                if (categories == null) {
                    languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: categories,
                        });
                    });
                } else {
                    languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                        res.json({
                            status: statics.STATUS_SUCCESS,
                            code: codes.SUCCESS,
                            message: msg.message,
                            data: categories,
                        });
                    })

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
    var credentials = req.body;

    var errors = validationResult(req);
    if (errors.array().length == 0) {

        if (!credentials.name || credentials.name == '') {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.FAILURE,
                message: 'EMPTY_FIELD_NAME',
                data: null
            });
            return;
        }

        if (!credentials.email || credentials.email == '') {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.FAILURE,
                message: 'EMPTY_FIELD_EMAIL',
                data: null
            });
            return;
        }

        if (!credentials.message || credentials.message == '') {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.FAILURE,
                message: 'EMPTY_FIELD_MESSAGE',
                data: null
            });
            return;
        }

        return new Promise(function (resolve, reject) {
            {
                ContactServices.create(credentials).then(contact => {
                    resolve(contact);
                    if (contact == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: contact,
                            });
                        })
                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: contact,
                            });
                        })
                    }
                }, error => {
                    reject(error);
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
        })
    }

});
router.put('/admin/update', async function (req, res) {

    var lang = req.headers.language;
    var credentials = req.body;
    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }

    var errors = validationResult(req);
    if (errors.array().length == 0) {

        return new Promise(function (resolve, reject) {
            if (!credentials || !credentials.contact_id || credentials.contact_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_contact_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.name_ar || credentials.name_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_NAME_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.name_ar || credentials.name_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_NAME_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else {
                console.log(JSON.stringify(credentials));
                ContactServices.update(credentials).then(contact => {
                    resolve(contact);
                    if (contact == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: contact,
                            });
                        })
                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: contact,
                            });
                        })
                    }
                }, error => {
                    reject(error);
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
        })
    }
});
router.delete('/admin/delete/:banner_id', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {


        var credentials = req.params;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        return new Promise(function (resolve, reject) {
            ContactServices.delete(credentials.banner_id).then(response => {
                resolve(response);
                if (response == 0) {
                    languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else {
                    languageService.get_lang(lang, 'SUCCESS').then(msg => {
                        res.json({
                            status: statics.STATUS_SUCCESS,
                            code: codes.SUCCESS,
                            message: msg.message,
                            data: response
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