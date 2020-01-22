var express = require('express');
const { validationResult } = require('express-validator/check');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var dashboardServices = require('../service/dashboard');
var languageService = require('../validator/language');
var config = require('../constant/config.js');
const jwt = require('jsonwebtoken');
var router = express.Router();

var id;
var servicePro;
var salesRep;
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
        salesRep = decoded.salesRep;;
        servicePro = decoded.servicePro;;
        return decoded.id;

    });
}


router.get('/admin/get', async function (req, res) {

    var errors = validationResult(req);

    if (errors.array().length == 0) {
        var credentials = req.params;
        var lang = req.headers.pragma;

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        return new Promise(function (resolve, reject) {
            dashboardServices.Admin().then(response => {
                resolve(response);
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: response
                    });
                });
            },
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
router.get('/ServicePro/get', async function (req, res) {

    var errors = validationResult(req);

    if (errors.array().length == 0) {
        var credentials = req.params;
        var lang = req.headers.pragma;

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        console.log(id);
        return new Promise(function (resolve, reject) {
            dashboardServices.ServicePro(id).then(response => {
                resolve(response);
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: response
                    });
                });
            },
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

router.get('/SalesRep/get', async function (req, res) {

    var errors = validationResult(req);

    if (errors.array().length == 0) {
        var credentials = req.params;
        var lang = req.headers.pragma;

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        console.log(id);
        return new Promise(function (resolve, reject) {
            dashboardServices.SalesRep(id).then(response => {
                resolve(response);
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: response
                    });
                });
            },
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