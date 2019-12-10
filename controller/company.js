var express = require('express');
const { validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var CompanyService = require('../service/company');
var router = express.Router();


router.get('/filter', function (req, res) {
    var errors = validationResult(req);
    if (errors.array().length == 0) {

        var lang = req.headers.language;
        var lang = req.headers.language;
        var data = req.body;
        var latitude = Number(data.latitude) ? Number(data.latitude) : 0;
        var longitude = Number(data.longitude) ? Number(data.longitude) : 0;
        var location_name = data.location_name ? data.location_name : '';
        var page = req.body.page; // start from 0
        if (page < 0) {
            languageService.get_lang(lang, 'MISSING_PAGE_NUMBER').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: [],
                })
            })
        } else {
            return new Promise(function (resolve, reject) {
                CompanyService.filter_companies(latitude, longitude, location_name, page).then(deals => {
                    resolve(deals);
                    if (deals == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: [],
                            });
                        });
                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: deals,
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
module.exports = router;