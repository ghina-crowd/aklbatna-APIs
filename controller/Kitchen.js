var express = require('express');
const { validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var KitchenService = require('../service/Kitchen');
var Notifications = require('../repository/Notifications');
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
router.get('/get', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;
        // await verifyToken(token, res, lang);
        // if (!id) {
        //     return;
        // }
        return new Promise(function (resolve, reject) {
            KitchenService.getAll().then(kitchens => {
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
router.get('/getByCategoryID/:category_id', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;
        // await verifyToken(token, res, lang);
        // if (!id) {
        //     return;
        // }
        return new Promise(function (resolve, reject) {
            KitchenService.getByCategoryID(req.params.category_id).then(kitchens => {
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
router.post('/getByLocation', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;



        var data = req.body;
        var page = req.body.page ? req.body.page : 0;
        var lat = req.body.lat ? req.body.lat : 0;
        var lng = req.body.lng ? req.body.lng : 0;
        var keyword = req.body.keyword ? req.body.keyword : '';

        var filters = {};
        filters.lat = lat;
        filters.lng = lng;
        filters.page = page;
        filters.keyword = keyword;

        return new Promise(function (resolve, reject) {
            KitchenService.getAllByLocation(filters).then(kitchens => {
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
router.post('/admin/get', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        var data = req.body;
        var category_id = Number(data.category_id) ? Number(data.category_id) : 0;
        var page = req.body.page ? req.body.page : 0;
        var keyword = req.body.keyword ? req.body.keyword : '';

        var filters = {};
        filters.category_id = category_id;
        filters.page = page;
        filters.keyword = keyword;
        if (page < 0) {
            languageService.get_lang(lang, 'MISSING_PAGE_NUMBER').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: [],
                })
            });
        } else {
            return new Promise(function (resolve, reject) {
                KitchenService.getAllAdmin(filters).then(kitchens => {
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
router.get('/get/:kitchen_id', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;
        // await verifyToken(token, res, lang);
        // if (!id) {
        //     return;
        // }
        return new Promise(function (resolve, reject) {
            KitchenService.get(req.params.kitchen_id).then(kitchens => {
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
router.get('/admin/get/:kitchen_id', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }
        return new Promise(function (resolve, reject) {
            KitchenService.getAdmin(req.params.kitchen_id).then(kitchens => {
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
                } else if (!credentials.category_id || credentials.category_id == '') {

                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_CATEGORY_ID',
                        data: null
                    });

                } else if (!credentials.user_id || credentials.user_id == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_USER_ID',
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
                } else if (!credentials.description_ar || credentials.description_ar == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_DESCRIPTION_AR',
                        data: null
                    });
                } else if (!credentials.description_en || credentials.description_en == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_DESCRIPTION_EN',
                        data: null
                    });
                } else if (!credentials.start_time || credentials.start_time == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_START_TIME',
                        data: null
                    });
                } else if (!credentials.end_time || credentials.end_time == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_END_TIME',
                        data: null
                    });
                } else {
                    return new Promise(function (resolve, reject) {
                        KitchenService.create(credentials).then(account => {
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



router.post('/createWithSP', async function (req, res) {
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
                } else if (!credentials.category_id || credentials.category_id == '') {

                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_CATEGORY_ID',
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
                } else if (!credentials.description_ar || credentials.description_ar == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_DESCRIPTION_AR',
                        data: null
                    });
                } else if (!credentials.description_en || credentials.description_en == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_DESCRIPTION_EN',
                        data: null
                    });
                } else if (!credentials.start_time || credentials.start_time == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_START_TIME',
                        data: null
                    });
                } else if (!credentials.end_time || credentials.end_time == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_END_TIME',
                        data: null
                    });
                } else if (!credentials.email || credentials.email == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_EMAIL').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        })
                    });

                } else if (!credentials.first_name || credentials.first_name == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_FIRST').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (!credentials.last_name || credentials.last_name == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_LAST').then(msg => {

                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (!credentials.phone || credentials.phone == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_PHONE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (!credentials.active || credentials.active == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_ACTIVE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else {
                    return new Promise(function (resolve, reject) {
                        KitchenService.createWithSP(credentials).then(result => {

                            if (result.user == null) {
                                languageService.get_lang(lang, 'EMAIL_REGISTERED').then(msg => {
                                    res.json({
                                        status: statics.STATUS_FAILURE,
                                        code: codes.FAILURE,
                                        message: msg.message,
                                        data: null
                                    });
                                });
                            } else {
                                Notifications.create({
                                    title: 'Approvel Request',
                                    message: result.kitchen.name_en + ' created by ' + result.user.first_name + " " + result.user.last_name,
                                    action: '/pages/kitchen/' + result.kitchen.kitchen_id,

                                })
                                languageService.get_lang(lang, 'SUCCESS_CREATE_WITH_SP').then(msg => {
                                    res.json({
                                        status: statics.STATUS_SUCCESS,
                                        code: codes.SUCCESS,
                                        message: msg.message,
                                        data: result
                                    });
                                });
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


router.put('/admin/update', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);

    try {
        if (errors.array().length == 0) {
            var credentials = req.body;
            var lang = req.headers.language;

            return new Promise(function (resolve, reject) {

                if (!credentials.kitchen_id || credentials.kitchen_id == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_KITCHEN_ID',
                        data: null
                    });
                } else if (!credentials.image || credentials.image == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_IMAGE',
                        data: null
                    });
                } else if (!credentials.category_id || credentials.category_id == '') {

                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_CATEGORY_ID',
                        data: null
                    });

                } else if (!credentials.user_id || credentials.user_id == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_USER_ID',
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
                } else if (!credentials.description_ar || credentials.description_ar == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_DESCRIPTION_AR',
                        data: null
                    });
                } else if (!credentials.description_en || credentials.description_en == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_DESCRIPTION_EN',
                        data: null
                    });
                } else if (!credentials.start_time || credentials.start_time == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_START_TIME',
                        data: null
                    });
                } else if (!credentials.end_time || credentials.end_time == '') {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: 'EMPTY_FIELD_END_TIME',
                        data: null
                    });
                } else {
                    return new Promise(function (resolve, reject) {
                        KitchenService.update(credentials).then(account => {
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
router.delete('/admin/delete/:kitchen_id', async function (req, res) {
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
                    KitchenService.delete(req.params.kitchen_id).then(account => {
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
    var kitchen_id = req.params.kitchen_id;
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
                KitchenService.get_Reviews(page, kitchen_id).then(reviews => {
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
                KitchenService.create_review(data).then(rate => {
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