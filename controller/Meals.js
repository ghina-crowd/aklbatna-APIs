var express = require('express');
const { validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var MealsService = require('../service/Meals');
const jwt = require('jsonwebtoken');
var config = require('../constant/config.js');


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


async function userInfoFromToken(token) {
    id = undefined;
    if (!token) {
        return
    }
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            return
        }
        id = decoded.id;
        return decoded.id;
    });
}


router.post('/filter', async function (req, res) {
    var errors = validationResult(req);
    var token = req.headers.authorization;
    await userInfoFromToken(token);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var data = req.body;
        var category_id = Number(data.category_id) ? Number(data.category_id) : 0;
        var kitchen_id = Number(data.kitchen_id) ? Number(data.kitchen_id) : 0;
        var sort_by = data.sort_by ? data.sort_by : 0; // 1 => price low to high , 2 => price high to low , 3 => distance
        var rating = data.rating ? data.rating : 0;
        var page = req.body.page ? req.body.page : 0;
        var type = req.body.type ? req.body.type : 0;
        var keyword = req.body.keyword ? req.body.keyword : '';

        var filters = {};
        filters.category_id = category_id;
        filters.sort_by = sort_by;
        filters.type = type;
        filters.rating = rating;
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
        } else {
            return new Promise(function (resolve, reject) {
                MealsService.filters(filters, id).then(meals => {
                    resolve(meals);
                    if (meals == null || meals.length == 0) {
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
                                data: meals,
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
router.get('/get/related/:meal_id/:category_id', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await userInfoFromToken(token);
        // await verifyToken(token, res, lang);
        // if (!id) {
        //     return;
        // }
        return new Promise(function (resolve, reject) {
            MealsService.get_related_meals(req.params.meal_id, req.params.category_id, id).then(meals => {
                resolve(meals);
                if (meals == null) {
                    meals = [];
                }
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: meals
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


router.get('/get/featured/:page/:sortBy', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await userInfoFromToken(token);
        // await verifyToken(token, res, lang);
        // if (!id) {
        //     return;
        // }
        return new Promise(function (resolve, reject) {
            MealsService.get_featured_meals(req.params.page, req.params.sortBy, id).then(meals => {
                resolve(meals);
                if (meals == null) {
                    meals = [];
                }
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: meals
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


router.get('/get', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await userInfoFromToken(token);
        // await verifyToken(token, res, lang);
        // if (!id) {
        //     return;
        // }
        return new Promise(function (resolve, reject) {
            MealsService.getAll(id).then(kitchens => {
                resolve(kitchens);
                if (kitchens == null) {
                    kitchens = [];
                }
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: kitchens
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

router.get('/get/:kitchen_id', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await userInfoFromToken(token);
        // await verifyToken(token, res, lang);
        // if (!id) {
        //     return;
        // }
        return new Promise(function (resolve, reject) {
            MealsService.get(req.params.kitchen_id, id).then(kitchens => {
                resolve(kitchens);
                if (kitchens == null) {
                    kitchens = [];
                }
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: kitchens
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
router.post('/admin/create', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);

    try {
        if (errors.array().length == 0) {
            var credentials = req.body;
            var lang = req.headers.language;

            return new Promise(function (resolve, reject) {

                if (!credentials.image || credentials.image == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_IMAGE',
                        data: null
                    });
                } else if (!credentials.menu_id || credentials.menu_id == '') {

                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_MENU_ID',
                        data: null
                    });

                } else if (!credentials.type || credentials.type == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_TYPE',
                        data: null
                    });
                } else if (!credentials.name_ar || credentials.name_ar == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_NAME_AR',
                        data: null
                    });
                } else if (!credentials.name_en || credentials.name_en == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_NAME_EN',
                        data: null
                    });
                } else if (!credentials.price || credentials.price == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_PRICE',
                        data: null
                    });
                } else if (!credentials.price_monthly || credentials.price_monthly == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_PRICE_MONETHLY',
                        data: null
                    });
                } else if (!credentials.price_weekly || credentials.price_weekly == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_PRICE_WEEKLY',
                        data: null
                    });
                } else if (!credentials.category_id || credentials.category_id == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_CATEGORY_ID',
                        data: null
                    });
                } else if (!credentials.kitchen_id || credentials.kitchen_id == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_KITCHEN_ID',
                        data: null
                    });
                } else {
                    return new Promise(function (resolve, reject) {
                        MealsService.create(credentials).then(account => {
                            resolve(account);
                            languageService.get_lang(lang, 'SUCCESS').then(msg => {
                                res.json({
                                    status: statics.STATUS_SUCCESS,
                                    code: codes.SUCCESS,
                                    message: msg.message,
                                    data: account
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
router.put('/admin/update', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);

    try {
        if (errors.array().length == 0) {
            var credentials = req.body;
            var lang = req.headers.language;

            return new Promise(function (resolve, reject) {

                if (!credentials.meal_id || credentials.meal_id == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_MEAL_ID',
                        data: null
                    });
                } else if (!credentials.image || credentials.image == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_IMAGE',
                        data: null
                    });
                } else if (!credentials.name_ar || credentials.name_ar == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_NAME_AR',
                        data: null
                    });
                } else if (!credentials.name_en || credentials.name_en == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_NAME_EN',
                        data: null
                    });
                } else if (!credentials.type || credentials.type == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_TYPE',
                        data: null
                    });
                } else if (!credentials.price || credentials.price == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_PRICE',
                        data: null
                    });
                } else if (!credentials.price_monthly || credentials.price_monthly == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_PRICE_MONTHLY',
                        data: null
                    });
                } else if (!credentials.price_weekly || credentials.price_weekly == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_PRICE_WEEKLY',
                        data: null
                    });
                } else {
                    return new Promise(function (resolve, reject) {
                        MealsService.update(credentials).then(account => {
                            resolve(account);
                            languageService.get_lang(lang, 'SUCCESS').then(msg => {
                                res.json({
                                    status: statics.STATUS_SUCCESS,
                                    code: codes.SUCCESS,
                                    message: msg.message,
                                    data: account
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
router.delete('/admin/delete/:meal_id', async function (req, res) {
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
                    MealsService.delete(req.params.meal_id).then(account => {
                        resolve(account);

                        if (account) {
                            languageService.get_lang(lang, 'SUCCESS').then(msg => {
                                res.json({
                                    status: statics.STATUS_SUCCESS,
                                    code: codes.SUCCESS,
                                    message: msg.message,
                                    data: account
                                });
                            });
                        } else {
                            languageService.get_lang(lang, 'INVALID_ACCOUNT_ID').then(msg => {
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


router.get('/reviews/:kitchen_id/:page', function (req, res) {

    var lang = req.headers.language;
    var page = req.params.page ? req.params.page : -1;
    var meal_id = req.params.kitchen_id;
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
                MealsService.get_Reviews(page, meal_id).then(reviews => {
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
router.post('/review', async function (req, res) {

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
                MealsService.create_review(data).then(rate => {
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
module.exports = router;