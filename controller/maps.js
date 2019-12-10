var express = require('express');
const { check, validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var logger = require('../util/logger.js');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var MapsService = require('../service/maps');
const jwt = require('jsonwebtoken');
var config = require('../constant/config.js');

var router = express.Router();
var email;
function verifyToken(token, res, lang) {
    email = undefined;
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
            return undefined;
        }
        email = decoded.email;
        return decoded.id;

    });
}


router.get('/places', function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var data = req.body;
        var lang = req.headers.language;
        var address = data.address ? data.address : undefined;
        if (address) {
            MapsService.getPlaces(address).then(response => {
                languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: response.json
                    });
                });
            }, error => {
                languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: [],
                    });
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
        });

    }

}
);


router.get('/details', function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var data = req.body;
        var lang = req.headers.language;
        var place_id = data.place_id ? data.place_id : undefined;
        if (place_id) {
            MapsService.getDetails(place_id).then(response => {
                languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: response.json.result
                    });
                });
            }, error => {
                console.log(error);
                languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: [],
                    });
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
        });

    }

}
);


module.exports = router;