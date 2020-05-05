var express = require('express');
const { validationResult } = require('express-validator/check');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var dealServices = require('../service/deals.js');
var languageService = require('../validator/language');
var config = require('../constant/config.js');
const path = require('path');
const Resize = require('../util/Resize');
const utils = require('../util/utils');
const multer = require('multer');

const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});

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
router.get('/admin/deal/:id', function (req, res) {

    var lang = req.headers.language;
    var id = req.params.id;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        return new Promise(function (resolve, reject) {
            dealServices.get_deal_by_id_admin(id).then(deals => {
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
        var city = Number(data.city_id) ? Number(data.city_id) : 0;
        var date = data.date ? data.date : '';
        var monthly_new = data.monthly_new ? data.monthly_new : ''; // 1 => monthly , 2 => new
        var sort_by = data.sort_by ? data.sort_by : ''; // 1 => price low to high , 2 => price high to low , 3 => distance
        var rating = data.rating ? data.rating : '';

        var page = req.body.page ? req.body.page : 0;
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
                dealServices.filter_deals(category_id, sub_category_id, min_price, max_price, date, monthly_new, sort_by, rating, page, keyword, latitude, longitude, city).then(deals => {
                    resolve(deals);
                    if (deals == null || deals.length == 0) {
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
router.post('/bestsales', function (req, res) {
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var data = req.body;
        var category_id = Number(data.category_id) ? Number(data.category_id) : 0;
        var sub_category_id = Number(data.sub_category_id) ? Number(data.sub_category_id) : 0; {
            return new Promise(function (resolve, reject) {
                dealServices.bestsales(category_id, sub_category_id).then(deals => {
                    resolve(deals);
                    if (deals == null || deals.length == 0) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: {},
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
router.post('/admin/filter', function (req, res) {
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
        var city = Number(data.city_id) ? Number(data.city_id) : 0;
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
                dealServices.filter_dealsAdmin(category_id, sub_category_id, min_price, max_price, date, monthly_new, sort_by, rating, page, keyword, latitude, longitude, city).then(deals => {
                    resolve(deals);
                    if (deals == null || deals.length == 0) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: {},
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

router.post('/rating', async function (req, res) {

    var lang = req.headers.language;
    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }
    data = req.body;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        return new Promise(function (resolve, reject) {
            if (id) {
                dealServices.create_rate(id, data.deal_id, data.rate, data.comment).then(rate => {
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
router.delete('/admin/reviews/delete/:rating_id', async function (req, res) {

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
            dealServices.delete_review(credentials.rating_id).then(response => {
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


//Deal by user id but i have no idea lol why salesRep we can use this for every user .
router.get('/salesRep/get_deals/:page', async function (req, res) {
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }
        var page = req.params.page;

        return new Promise(function (resolve, reject) {
            dealServices.get_salesRep_deals(id, page).then(deals => {
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
router.get('/ServicePro/get_deals/:page', async function (req, res) {
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        var page = req.params.page;

        return new Promise(function (resolve, reject) {
            dealServices.get_servicePro_deals(id, page).then(deals => {
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
router.get('/admin/get_deals/:page', function (req, res) {
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var page = req.params.page; // start from 0
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
router.post('/admin/create',
    upload.array('images'),
    async function (req, res) {


        var lang = req.headers.language;
        var credentials = req.body;

        console.log(credentials)

        var errors = validationResult(req);
        if (errors.array().length == 0) {

            var token = req.headers.authorization;
            await verifyToken(token, res, lang);
            if (!id) {
                return;
            }

            return new Promise(async function (resolve, reject) {

                if (!credentials) {
                    languageService.get_lang(lang, 'EMPTY_FIELDS').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (!credentials.sub_category_id || credentials.sub_category_id == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_SUB_CATEGORY_ID').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (!credentials.shop_category_id || credentials.shop_category_id == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_CATEGORY_ID').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (!credentials.company_id || credentials.company_id == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_COMPANY_ID').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.branch_id || credentials.branch_id == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_BRANCH_ID').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.deal_title_en || credentials.deal_title_en == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_DEAL_TITLE_EN').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.deal_title_ar || credentials.deal_title_ar == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_DEAL_TITLE_AR').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.details_en || credentials.details_en == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_DETAILS_EN').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.details_ar || credentials.details_ar == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_DETAILS_AR').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.pre_price || credentials.pre_price == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC_PRE_PRICE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.new_price || credentials.new_price == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_NEW_PRICE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.start_time || credentials.start_time == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_START_DATE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.main_image || credentials.main_image == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_MAIN_IMAGE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else {
                    //checking who is creating this deal.
                    credentials['user_id'] = id;
                    dealServices.create_deal(credentials).then(async deal => {
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
                            });
                            if (servicePro) {
                                utils.SendEmail(config.adminemail, 'New Deal Created', ' <p>Hello Admin</p> . </p> <p> Services provider created new deal into your platform please visit this <a href= "' + config.adminurl + 'pages/deal_details/' + deal.deal_id + '" target = "_self"> link </a> to see more details.</p>   ');
                            } else if (salesRep) {
                                utils.SendEmail(config.adminemail, 'New Deal Created', ' <p>Hello Admin</p> . </p> <p> Sales Pin Code:' + String(1000 + Number(id)) + ' created new deal into your platform please visit this <a href= "' + config.adminurl + 'pages/deal_details/' + deal.deal_id + '" target = "_self"> link </a> to see more details.</p>   ');
                            } else {
                                console.log('by any other user');
                            }
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

router.put('/admin/update',
    upload.array('images'),
    async function (req, res) {


        var lang = req.headers.language;
        var credentials = req.body;
        var token = req.headers.authorization;
        console.log(credentials)
        var errors = validationResult(req);
        if (errors.array().length == 0) {

            var token = req.headers.authorization;
            await verifyToken(token, res, lang);
            if (!id) {
                return;
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
                } else if (!credentials.deal_id || credentials.deal_id == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_DEAL_ID').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (!credentials.sub_category_id || credentials.sub_category_id == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_SUB_CATEGORY_ID').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (!credentials.shop_category_id || credentials.shop_category_id == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_CATEGORY_ID').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (!credentials.company_id || credentials.company_id == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_COMPANY_ID').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.branch_id || credentials.branch_id == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_BRANCH_ID').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.deal_title_en || credentials.deal_title_en == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_DEAL_TITLE_EN').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.deal_title_ar || credentials.deal_title_ar == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_DEAL_TITLE_AR').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.details_en || credentials.details_en == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_DETAILS_EN').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.details_ar || credentials.details_ar == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_DETAILS_AR').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.pre_price || credentials.pre_price == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC_PRE_PRICE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.new_price || credentials.new_price == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_NEW_PRICE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.start_time || credentials.start_time == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELDS_START_DATE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else if (!credentials.main_image || credentials.main_image == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_MAIN_IMAGE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });

                } else {
                    dealServices.update_deal(credentials).then(async deal => {
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
router.delete('/admin/delete/:deal_id', async function (req, res) {

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.params;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }
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
router.delete('/admin/image/delete/:image_id', async function (req, res) {

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.params;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        if (!credentials || !credentials.image_id || credentials.image_id == '') {
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
                dealServices.delete_deal_image(credentials.image_id).then(response => {
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
router.post('/admin/image/create', async function (req, res) {


    var lang = req.headers.language;
    var credentials = req.body;

    var errors = validationResult(req);
    if (errors.array().length == 0) {

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        if (!credentials) {
            languageService.get_lang(lang, 'EMPTY_FIELDS').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else if (!credentials.source || credentials.source == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_IMAGE').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
        } else {
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

router.put('/admin/image/update', upload.single('image'), async function (req, res) {


    var lang = req.headers.language;
    var credentials = req.body;
    var errors = validationResult(req);
    if (errors.array().length == 0) {

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

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
        const fileUpload = new Resize(imagePath, new Date().getTime() + '.png');
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
    var errors = validationResult(req);
    if (errors.array().length == 0) {

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }


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

router.put('/admin/Sub_update', async function (req, res) {


    var lang = req.headers.language;
    var credentials = req.body;

    var errors = validationResult(req);
    if (errors.array().length == 0) {

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
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

router.delete('/admin/Sub_delete/:id', async function (req, res) {

    var errors = validationResult(req);

    if (errors.array().length == 0) {
        var credentials = req.params;
        var lang = req.headers.pragma;

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }


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

//Info Deals Routers
router.post('/admin/info/create', async function (req, res) {


    var lang = req.headers.language;
    var credentials = req.body;
    var errors = validationResult(req);
    if (errors.array().length == 0) {

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

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
            } else if (!credentials.details_en || credentials.details_en == '') {
                languageService.get_lang(lang, 'EMPTY_FIELDS_DETAILS_EN').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.details_ar || credentials.details_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELDS_DETAILS_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else {
                dealServices.create_deal_info(credentials).then(deal => {
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


router.delete('/admin/info/delete/:info_id', async function (req, res) {

    var errors = validationResult(req);

    if (errors.array().length == 0) {
        var credentials = req.params;
        var lang = req.headers.pragma;

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }


        if (!credentials.info_id || credentials.info_id == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_INFO_ID').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                })
            });

        } else {
            return new Promise(function (resolve, reject) {
                dealServices.delete_deal_info(credentials.info_id).then(response => {
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




//Conditions Deals Routers
router.post('/admin/condition/create', async function (req, res) {


    var lang = req.headers.language;
    var credentials = req.body;
    var errors = validationResult(req);
    if (errors.array().length == 0) {

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

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
            } else if (!credentials.details_en || credentials.details_en == '') {
                languageService.get_lang(lang, 'EMPTY_FIELDS_DETAILS_EN').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.details_ar || credentials.details_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELDS_DETAILS_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else {
                dealServices.create_deal_condition(credentials).then(deal => {
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


router.delete('/admin/condition/delete/:condition_id', async function (req, res) {

    var errors = validationResult(req);

    if (errors.array().length == 0) {
        var credentials = req.params;
        var lang = req.headers.pragma;

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }


        if (!credentials.condition_id || credentials.condition_id == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_INFO_ID').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                })
            });

        } else {
            return new Promise(function (resolve, reject) {
                dealServices.delete_deal_condition(credentials.condition_id).then(response => {
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