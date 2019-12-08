var express = require('express');
const {check, validationResult} = require('express-validator/check');
var statics = require('../constant/static.js');
var messages = require('../constant/message.js');
var ar_messages = require('../constant/arabic_messages.js');
var codes = require('../constant/code.js');
var categoryServices = require('../service/categories.js');
var authenticationValidator = require('../validator/authentication.js');
const multer = require('multer');
var languageService = require('../validator/language');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '_' + file.originalname);
    }
});
const upload = multer({storage: storage});
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
var router = express.Router();


router.get('/get_categories_subCategories', function (req, res) {

    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        return new Promise(function (resolve, reject) {
            categoryServices.get_categories_sub_categories().then(categories => {
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

router.get('/categories', function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {

        return new Promise(function (resolve, reject) {
            categoryServices.get_categories().then(categories => {
                resolve(categories);
                if (categories == null) {

                    languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: categories,
                        });
                    })

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

module.exports = router;