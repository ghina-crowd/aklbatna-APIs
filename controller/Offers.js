var express = require('express');
const { validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var OffersService = require('../service/Offers');
const jwt = require('jsonwebtoken');
var config = require('../constant/config.js');
var Messaging = require('../util/firebase');


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

router.post('/get', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);



    var data = req.body;
    var category_id = Number(data.category_id) ? Number(data.category_id) : 0;
    var kitchen_id = Number(data.kitchen_id) ? Number(data.kitchen_id) : 0;
    var sort_by = data.sort_by ? data.sort_by : 0; // 1 => price low to high , 2 => price high to low , 3 => distance
    var page = req.body.page ? req.body.page : 0;
    var type = req.body.type ? req.body.type : 0;
    var keyword = req.body.keyword ? req.body.keyword : '';

    var filters = {};
    filters.category_id = category_id;
    filters.sort_by = sort_by;
    filters.type = type;
    filters.page = page;
    filters.keyword = keyword;
    filters.kitchen_id = kitchen_id;

    if (page < 0) {
        languageService.get_lang(lang, 'MISSING_PAGE_NUMBER').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.FAILURE,
                message: msg.message,
                data: [],
            })
        })
    }
    else if (errors.array().length == 0) {
        var lang = req.headers.language;
        return new Promise(function (resolve, reject) {
            OffersService.getAll(filters).then(offers => {
                resolve(offers);
                if (offers == null) {
                    offers = [];
                }
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: offers
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
router.post('/admin/get', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);



    var data = req.body;
    var category_id = Number(data.category_id) ? Number(data.category_id) : 0;
    var kitchen_id = Number(data.kitchen_id) ? Number(data.kitchen_id) : 0;
    var sort_by = data.sort_by ? data.sort_by : 0; // 1 => price low to high , 2 => price high to low , 3 => distance
    var page = req.body.page ? req.body.page : 0;
    var type = req.body.type ? req.body.type : 0;
    var keyword = req.body.keyword ? req.body.keyword : '';

    var filters = {};
    filters.category_id = category_id;
    filters.sort_by = sort_by;
    filters.type = type;
    filters.page = page;
    filters.keyword = keyword;
    filters.kitchen_id = kitchen_id;

    if (page < 0) {
        languageService.get_lang(lang, 'MISSING_PAGE_NUMBER').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.FAILURE,
                message: msg.message,
                data: [],
            })
        })
    }
    else if (errors.array().length == 0) {
        var lang = req.headers.language;
        return new Promise(function (resolve, reject) {
            OffersService.getAllAdmin(filters).then(offers => {
                resolve(offers);
                if (offers == null) {
                    offers = [];
                }
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: offers
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
router.get('/get/:offer_id', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    var token = req.headers.authorization;
    // await verifyToken(token, res, lang);
    // if (!id) {
    //     return;
    // }
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        return new Promise(function (resolve, reject) {
            OffersService.get(req.params.offer_id).then(offers => {
                resolve(offers);
                if (offers == null) {
                    offers = {};
                }
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: offers
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
    var token = req.headers.authorization;
    await verifyToken(token, res, lang);

    if (!id) {
        return;
    }

    try {
        if (errors.array().length == 0) {
            var credentials = req.body;
            var lang = req.headers.language;


            return new Promise(function (resolve, reject) {

                if (!credentials.price || credentials.price == '') {
                    languageService.get_lang(lang, 'price').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                }
                else if (!credentials.image || credentials.image == '') {
                    languageService.get_lang(lang, 'image').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                }
                else if (!credentials.title_ar || credentials.title_ar == '') {
                    languageService.get_lang(lang, 'title_ar').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                }
                else
                    if (!credentials.title_en || credentials.title_en == '') {
                        languageService.get_lang(lang, 'title_en').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    }
                    else
                        if (!credentials.description_ar || credentials.description_ar == '') {
                            languageService.get_lang(lang, 'description_ar').then(msg => {
                                res.json({
                                    status: statics.STATUS_FAILURE,
                                    code: codes.FAILURE,
                                    message: msg.message,
                                    data: null
                                });
                            });
                        } else
                            if (!credentials.description_en || credentials.description_en == '') {
                                languageService.get_lang(lang, 'description_en').then(msg => {
                                    res.json({
                                        status: statics.STATUS_FAILURE,
                                        code: codes.FAILURE,
                                        message: msg.message,
                                        data: null
                                    });
                                });
                            }
                            else if (!credentials.meal_id || credentials.meal_id == '') {
                                languageService.get_lang(lang, 'meal_id').then(msg => {
                                    res.json({
                                        status: statics.STATUS_FAILURE,
                                        code: codes.FAILURE,
                                        message: msg.message,
                                        data: null
                                    });
                                });
                            }
                            else if (!credentials.status || credentials.status == '') {
                                languageService.get_lang(lang, 'status').then(msg => {
                                    res.json({
                                        status: statics.STATUS_FAILURE,
                                        code: codes.FAILURE,
                                        message: msg.message,
                                        data: null
                                    });
                                });
                            }
                            else if (!credentials.kitchen_id || credentials.kitchen_id == '') {
                                languageService.get_lang(lang, 'kitchen_id').then(msg => {
                                    res.json({
                                        status: statics.STATUS_FAILURE,
                                        code: codes.FAILURE,
                                        message: msg.message,
                                        data: null
                                    });
                                });
                            }
                            else {
                                credentials.user_id = id;
                                console.log(credentials);
                                return new Promise(function (resolve, reject) {
                                    OffersService.create(credentials).then(offer => {
                                        resolve(offer);
                                        languageService.get_lang(lang, 'SUCCESS').then(msg => {
                                            res.json({
                                                status: statics.STATUS_SUCCESS,
                                                code: codes.SUCCESS,
                                                message: msg.message,
                                                data: offer
                                            });
                                        });

                                        if (String(credentials.status) === '1') {
                                            var messageObj = {};
                                            messageObj.data = { offer_id: String(offer['dataValues'].offer_id), notifcationType: 'Offers' };
                                            messageObj.title = 'Aklbenta';
                                            messageObj.body = credentials.title_ar;
                                            messageObj.to = '/topics/offersar';
                                            messageObj.token = '/topics/offersar';
                                            messageObj.webpush = { headers: { Urgency: 'high' } };
                                            messageObj.notification = {
                                                title: 'Aklbenta', body: credentials.title_ar,
                                                clickAction: 'OPEN_ACTIVITY_1',
                                                icon: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg'
                                            };
                                            messageObj.android = { notification: { title: 'Aklbenta', body: credentials.title, image: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg', click_action: "OPEN_ACTIVITY_1", priority: 'height' } };

                                            Messaging.sendNotificaitonToSingleUser(messageObj);



                                            var messageObj = {};
                                            messageObj.data = { offer_id: String(offer['dataValues'].offer_id), notifcationType: 'Offers' };
                                            messageObj.title = 'Aklbenta';
                                            messageObj.body = credentials.title_en;
                                            messageObj.to = '/topics/offersen';
                                            messageObj.token = '/topics/offersen';
                                            messageObj.webpush = { headers: { Urgency: 'high' } };
                                            messageObj.notification = {
                                                title: 'Aklbenta', body: credentials.title_en,
                                                clickAction: 'OPEN_ACTIVITY_1',
                                                icon: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg'
                                            };
                                            messageObj.android = { notification: { title: 'Aklbenta', body: credentials.title, image: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg', click_action: "OPEN_ACTIVITY_1", priority: 'height' } };

                                            Messaging.sendNotificaitonToSingleUser(messageObj)

                                        }


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
    } catch (ex) {
        console.log(ex);
    }
}
);
router.put('/update', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }
    try {
        if (errors.array().length == 0) {
            var credentials = req.body;
            var lang = req.headers.language;
            if (!credentials.price || credentials.price == '') {
                languageService.get_lang(lang, 'price').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            }
            else if (!credentials.image || credentials.image == '') {
                languageService.get_lang(lang, 'image').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else
                if (!credentials.offer_id || credentials.offer_id == '') {
                    languageService.get_lang(lang, 'offer_id').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                }
                else if (!credentials.title_ar || credentials.title_ar == '') {
                    languageService.get_lang(lang, 'title_ar').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                }
                else
                    if (!credentials.title_en || credentials.title_en == '') {
                        languageService.get_lang(lang, 'title_en').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    }
                    else
                        if (!credentials.description_ar || credentials.description_ar == '') {
                            languageService.get_lang(lang, 'description_ar').then(msg => {
                                res.json({
                                    status: statics.STATUS_FAILURE,
                                    code: codes.FAILURE,
                                    message: msg.message,
                                    data: null
                                });
                            });
                        } else
                            if (!credentials.description_en || credentials.description_en == '') {
                                languageService.get_lang(lang, 'description_en').then(msg => {
                                    res.json({
                                        status: statics.STATUS_FAILURE,
                                        code: codes.FAILURE,
                                        message: msg.message,
                                        data: null
                                    });
                                });
                            }
                            else if (!credentials.meal_id || credentials.meal_id == '') {
                                languageService.get_lang(lang, 'meal_id').then(msg => {
                                    res.json({
                                        status: statics.STATUS_FAILURE,
                                        code: codes.FAILURE,
                                        message: msg.message,
                                        data: null
                                    });
                                });
                            }
                            else if (!credentials.status || credentials.status == '') {
                                languageService.get_lang(lang, 'status').then(msg => {
                                    res.json({
                                        status: statics.STATUS_FAILURE,
                                        code: codes.FAILURE,
                                        message: msg.message,
                                        data: null
                                    });
                                });
                            }
                            else if (!credentials.kitchen_id || credentials.kitchen_id == '') {
                                languageService.get_lang(lang, 'kitchen_id').then(msg => {
                                    res.json({
                                        status: statics.STATUS_FAILURE,
                                        code: codes.FAILURE,
                                        message: msg.message,
                                        data: null
                                    });
                                });
                            }
                            else {
                                return new Promise(function (resolve, reject) {
                                    {
                                        return new Promise(function (resolve, reject) {
                                            OffersService.update(credentials).then(offer => {
                                                resolve(offer);
                                                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                                                    res.json({
                                                        status: statics.STATUS_SUCCESS,
                                                        code: codes.SUCCESS,
                                                        message: msg.message,
                                                        data: offer
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
    } catch (ex) {
        console.log(ex);
    }
}
);
router.delete('/delete/:offer_id', async function (req, res) {
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
            {

                return new Promise(function (resolve, reject) {
                    OffersService.delete(req.params.offer_id).then(offer => {
                        resolve(offer);

                        if (offer) {
                            languageService.get_lang(lang, 'SUCCESS').then(msg => {
                                res.json({
                                    status: statics.STATUS_SUCCESS,
                                    code: codes.SUCCESS,
                                    message: msg.message,
                                    data: offer
                                });
                            });
                        } else {
                            languageService.get_lang(lang, 'INVALID_offer_ID').then(msg => {
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