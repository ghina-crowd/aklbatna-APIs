var express = require('express');
const {check, validationResult} = require('express-validator/check');
var statics = require('../constant/static.js');
var messages = require('../constant/message.js');
var ar_messages = require('../constant/arabic_messages.js');
var codes = require('../constant/code.js');
var dealServices = require('../service/deals.js');
var authenticationValidator = require('../validator/authentication.js');
const multer = require('multer');
var languageService = require('../validator/language');
var config = require('../constant/config.js');


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

var userID;
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
        userID = decoded.id;
        return decoded.id;

    });
}

router.get('/get_deals_by_categoryID/:id/:page', function (req, res) {
    lang = req.headers.language;
    var id = req.params.id;
    var page = req.params.page;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        return new Promise(function (resolve, reject) {
            dealServices.get_deals_by_categoryID(id, page).then(deals => {
                resolve(deals);
                if (deals == null) {
                    languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: deals,
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

router.get('/get_deals_by_subCategory/:id', function (req, res) {

    var lang = req.headers.language;
    var id = req.params.id;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        return new Promise(function (resolve, reject) {
            dealServices.get_deals_by_sub_category(id).then(deals => {
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

router.get('/deal/:id', function (req, res) {

    var lang = req.headers.language;
    var id = req.params.id;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        return new Promise(function (resolve, reject) {
            dealServices.get_deal_by_id(id).then(deals => {
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

router.post('/filter', function (req, res) {
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var data = req.body;
        var category_id = Number(data.category_id) ? Number(data.category_id) : 0;
        var sub_category_id = Number(data.sub_category_id) ? Number(data.sub_category_id) : 0;
        var min_price = data.min_price ? data.min_price : 0;
        var max_price = data.max_price ? data.max_price : 0;
        var latitude = Number(data.latitude) ? Number(data.latitude) : 0;
        var longitude = Number(data.longitude) ? Number(data.longitude) : 0;
        var date = data.date ? data.date : '';
        var monthly_new = data.monthly_new ? data.monthly_new : ''; // 1 => monthly , 2 => new
        var sort_by = data.sort_by ? data.sort_by : ''; // 1 => price low to high , 2 => price high to low , 3 => distance
        var rating = data.rating ? data.rating : '';
        var page = req.body.page  ; // start from 0
        var keyword = req.body.keyword  ? req.body.keyword : 0;
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
                dealServices.filter_deals(category_id, sub_category_id, min_price, max_price, date, monthly_new, sort_by, rating, page, keyword,latitude,longitude).then(deals => {
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

router.post('/rating', function (req, res) {

    var lang = req.headers.language;
    var token = req.headers.authorization;
    data = req.body;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        return new Promise(function (resolve, reject) {
           var d = verifyToken(token, res, lang);
            if (userID) {
                dealServices.create_rate(userID , data.deal_id, data.rate, data.comment).then(rate => {
                    resolve(rate);
                    if (rate == null) {
                        languageService.get_lang(lang, 'FAILED').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: [],
                            });
                        });
                    } else {
                        languageService.get_lang(lang, 'SUCCESS').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: rate,
                            });
                        });
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

router.get('/related_deals/:deal_id/:category_id', function (req, res) {
    var lang = req.headers.language;
    var category_id = req.params.category_id;
    var deal_id = req.params.deal_id;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        return new Promise(function (resolve, reject) {
            dealServices.get_related_deals(category_id, deal_id).then(deals => {
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

router.get('/reviews/:id/:page', function (req, res) {

    var lang = req.headers.language;
    var page = req.params.page ? req.params.page : -1;
    var deal_id = req.params.id;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        if (page < 0) {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.FAILURE,
                message: languageService.get_lang(lang, 'MISSING_PAGE_NUMBER').then(msg => {
                    resolve(msg);

                }),
                data: [],
            })
        } else {
            return new Promise(function (resolve, reject) {
                dealServices.get_Reviews(page, deal_id).then(reviews => {
                    resolve(reviews);
                    if (reviews == null) {
                        languageService.get_lang(lang, 'FAILED').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: [],
                            });
                        });
                    } else {
                        languageService.get_lang(lang, 'SUCCESS').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: reviews,
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

router.get('/sub_deals/:id', function (req, res) {
    var lang = req.headers.language;
    var deal_id = req.params.id;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
            return new Promise(function (resolve, reject) {
                dealServices.get_sub_deals(deal_id).then(sub_deals => {
                    resolve(sub_deals);
                    if (sub_deals == null) {
                        languageService.get_lang(lang, 'FAILED').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: [],
                            });
                        });
                    } else {
                        languageService.get_lang(lang, 'SUCCESS').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: sub_deals,
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


module.exports = router;