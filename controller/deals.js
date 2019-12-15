var express = require('express');
const { check, validationResult } = require('express-validator/check');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var dealServices = require('../service/deals.js');
const multer = require('multer');
var languageService = require('../validator/language');
var config = require('../constant/config.js');
const path = require('path');
const Resize = require('../util/Resize');

const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});

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
        var page = req.body.page; // start from 0
        var keyword = req.body.keyword ? req.body.keyword : 0;
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
                dealServices.filter_deals(category_id, sub_category_id, min_price, max_price, date, monthly_new, sort_by, rating, page, keyword, latitude, longitude).then(deals => {
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
                dealServices.create_rate(userID, data.deal_id, data.rate, data.comment).then(rate => {
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


//Deal Routers
router.get('/admin/get_deals', function (req, res) {
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var page = req.body.page; // start from 0
        var keyword = req.body.keyword ? req.body.keyword : 0;
        if (!page || page < 0) {
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
                dealServices.get_deals(page, keyword).then(deals => {
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
router.post('/admin/create', upload.array('main_image'), async function (req, res) {


    var lang = req.headers.language;
    var credentials = req.body;
    var token = req.headers.authorization;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        verifyToken(token, res, lang);

        if (!req.files) {
            languageService.get_lang(lang, 'EMPTY_FIELD_IMAGE').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
            return;
        }

        const relative_ptah = '/images/deals/';
        const imagePath = path.join(__dirname, '..' + relative_ptah);
        const fileUpload = new Resize(imagePath, new Date().toISOString() + '.png');
        const filename = await fileUpload.save(req.files[0].buffer);



        //uploading other images and save into array
        var temp_images = [];
        if (req.files.length > 1) {
            for (let k in req.files) {
                if (k != 0) {
                    const relative_ptah = '/images/deals/';
                    const imagePath = path.join(__dirname, '..' + relative_ptah);
                    const fileUpload = new Resize(imagePath, new Date().toISOString() + '.png');
                    const filename = await fileUpload.save(req.files[k].buffer);
                    temp_images.push(relative_ptah + filename)
                }
            }
        }
        return new Promise(function (resolve, reject) {

            if (!credentials) {
                languageService.get_lang(lang, 'EMPTY_FIELDS').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.user_id || credentials.user_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_NAME_EN').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.sub_category_id || credentials.sub_category_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_NAME_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.shop_category_id || credentials.shop_category_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_KEYWORD').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.company_id || credentials.company_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.deal_title_en || credentials.deal_title_en == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.deal_title_ar || credentials.deal_title_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.short_detail || credentials.short_detail == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.details_en || credentials.details_en == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.details_ar || credentials.details_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.pre_price || credentials.pre_price == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.new_price || credentials.new_price == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.start_time || credentials.start_time == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.active || credentials.active == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.premium || credentials.premium == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.location_address || credentials.location_address == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.is_monthly || credentials.is_monthly == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.final_rate || credentials.final_rate == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else {

                credentials['main_image'] = relative_ptah + filename;
                dealServices.create_deal(credentials, temp_images).then(deal => {

                    resolve(deal);
                    if (deal == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: deal,
                            });
                        })

                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: deal,
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
router.post('/admin/update', upload.single('main_image'), async function (req, res) {


    var lang = req.headers.language;
    var credentials = req.body;
    var token = req.headers.authorization;

    var errors = validationResult(req);
    if (errors.array().length == 0) {

        verifyToken(token, res, lang);

        //check if there is any file update
        if (req.file) {
            const relative_ptah = '/images/deals/';
            const imagePath = path.join(__dirname, '..' + relative_ptah);
            const fileUpload = new Resize(imagePath, new Date().toISOString() + '.png');
            const filename = await fileUpload.save(req.file.buffer);
            credentials['main_image'] = relative_ptah + filename;
        }


        return new Promise(function (resolve, reject) {

            if (!credentials) {
                languageService.get_lang(lang, 'EMPTY_FIELDS').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.user_id || credentials.user_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_USER_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.deal_id || credentials.deal_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_DEAL_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.user_id || credentials.user_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_NAME_EN').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.sub_category_id || credentials.sub_category_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_NAME_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.shop_category_id || credentials.shop_category_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_KEYWORD').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.company_id || credentials.company_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.deal_title_en || credentials.deal_title_en == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.deal_title_ar || credentials.deal_title_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.short_detail || credentials.short_detail == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.details_en || credentials.details_en == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.details_ar || credentials.details_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.pre_price || credentials.pre_price == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.new_price || credentials.new_price == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.start_time || credentials.start_time == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.active || credentials.active == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.premium || credentials.premium == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.location_address || credentials.location_address == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.is_monthly || credentials.is_monthly == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.final_rate || credentials.final_rate == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else {
                dealServices.update_deal(credentials).then(deal => {
                    resolve(deal);
                    if (deal == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: deal,
                            });
                        })
                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: deal,
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
router.delete('/admin/delete', function (req, res) {

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.body;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        verifyToken(token, res, lang);
        if (!credentials.deal_id || credentials.deal_id == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_DEAL_ID').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                })
            });

        } else {
            return new Promise(function (resolve, reject) {
                dealServices.delete_deal(credentials.deal_id).then(response => {
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

// Deal Images
router.delete('/admin/image/delete', function (req, res) {

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.body;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        verifyToken(token, res, lang);

        if (!credentials || !credentials.img_id || credentials.img_id == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_IMG_ID').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                })
            });

        } else {
            return new Promise(function (resolve, reject) {
                dealServices.delete_deal(credentials.img_id).then(response => {
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
router.post('/admin/image/create', upload.single('image'), async function (req, res) {


    var lang = req.headers.language;
    var credentials = req.body;
    var token = req.headers.authorization;


    var errors = validationResult(req);
    if (errors.array().length == 0) {
        verifyToken(token, res, lang);
        if (!req.file) {
            languageService.get_lang(lang, 'EMPTY_FIELD_IMAGE').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
            return;
        }
        const relative_ptah = '/images/deals/';
        const imagePath = path.join(__dirname, '..' + relative_ptah);
        const fileUpload = new Resize(imagePath, new Date().toISOString() + '.png');
        const filename = await fileUpload.save(req.file.buffer);


        return new Promise(function (resolve, reject) {

            if (!credentials) {
                languageService.get_lang(lang, 'EMPTY_FIELDS').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.deal_id || credentials.deal_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_DEAL_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else {
                credentials['source'] = relative_ptah + filename;
                console.log(JSON.stringify(credentials));
                dealServices.create_deal_image(credentials).then(deal => {
                    resolve(deal);
                    if (deal == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: deal,
                            });
                        })
                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: deal,
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

router.post('/admin/image/update', upload.single('image'), async function (req, res) {


    var lang = req.headers.language;
    var credentials = req.body;
    var token = req.headers.authorization;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        verifyToken(token, res, lang);

        if (!req.file) {
            languageService.get_lang(lang, 'EMPTY_FIELD_IMAGE').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
            return;
        }
        const relative_ptah = '/images/deals/';
        const imagePath = path.join(__dirname, '..' + relative_ptah);
        const fileUpload = new Resize(imagePath, new Date().toISOString() + '.png');
        const filename = await fileUpload.save(req.file.buffer);


        return new Promise(function (resolve, reject) {
            if (!credentials) {
                languageService.get_lang(lang, 'EMPTY_FIELDS').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.deal_id || credentials.deal_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_DEAL_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.img_id || credentials.img_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_IMG_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else {
                credentials['source'] = relative_ptah + filename;
                console.log(JSON.stringify(credentials));
                dealServices.update_deal_image(credentials).then(deal => {
                    resolve(deal);
                    if (deal == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: deal,
                            });
                        })
                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: deal,
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

//Sub Deals Routers
router.post('/admin/Sub_create', async function (req, res) {


    var lang = req.headers.language;
    var credentials = req.body;
    var token = req.headers.authorization;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        verifyToken(token, res, lang);


        return new Promise(function (resolve, reject) {

            console.log(credentials);
            if (!credentials) {
                languageService.get_lang(lang, 'EMPTY_FIELDS').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.deal_id || credentials.deal_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_DEAL_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.title_en || credentials.title_en == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_TITLE_EN').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.title_ar || credentials.title_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_TITLE_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.pre_price || credentials.pre_price == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_PRE_PRICE').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.new_price || credentials.new_price == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_NEW_PRICE').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else {
                dealServices.create_sub_deal(credentials).then(deal => {
                    resolve(deal);
                    if (deal == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: deal,
                            });
                        })
                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: deal,
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

router.post('/admin/Sub_update', async function (req, res) {


    var lang = req.headers.language;
    var credentials = req.body;
    var token = req.headers.authorization;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        verifyToken(token, res, lang);


        return new Promise(function (resolve, reject) {

            if (!credentials) {
                languageService.get_lang(lang, 'EMPTY_FIELDS').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.id || credentials.id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SUB_DEAL_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.deal_id || credentials.deal_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_DEAL_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.title_en || credentials.title_en == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_TITLE_EN').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.title_ar || credentials.title_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_TITLE_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.pre_price || credentials.pre_price == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_PRE_PRICE').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.new_price || credentials.new_price == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_NEW_PRICE').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else {

                dealServices.update_sub_deal(credentials).then(deal => {
                    resolve(deal);
                    if (deal == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: deal,
                            });
                        })
                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: deal,
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

router.delete('/admin/Sub_delete', function (req, res) {

    var errors = validationResult(req);

    if (errors.array().length == 0) {
        var credentials = req.body;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        verifyToken(token, res, lang);


        if (!credentials.id || credentials.id == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_SUB_DEAL_ID').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                })
            });

        } else {
            return new Promise(function (resolve, reject) {
                dealServices.delete_sub_deal(credentials.id).then(response => {
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