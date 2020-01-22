var express = require('express');
const { check, validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var MapsService = require('../service/maps');

var router = express.Router();

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
                var temp_response = {};
                if (response.json.result) {
                    temp_response.description = response.json.result.formatted_address;
                    temp_response.place_id = response.json.result.place_id;
                    temp_response.lat = response.json.result.geometry.location.lat;
                    temp_response.lng = response.json.result.geometry.location.lng;
                }
                languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: temp_response
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