var express = require('express');
const { validationResult } = require('express-validator/check');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var categoryServices = require('../service/categories.js');
const multer = require('multer');
var languageService = require('../validator/language');
const path = require('path');
const Resize = require('../util/Resize');
var config = require('../constant/config.js');

const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});

const jwt = require('jsonwebtoken');
var router = express.Router();


var id;
function verifyToken(token, res, lang) {
    if (!token) {
        languageService.get_lang(lang, 'NO_TOKEN').then(msg => {
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

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            languageService.get_lang(lang, 'FAILED_AUTHENTICATE_TOKEN').then(msg => {
                res.send({
                    status: statics.STATUS_FAILURE,
                    code: codes.TOKEN_INVALID,
                    message: msg.message,
                    data: null
                });
            });
            return
        }
        id = decoded.id;
        return decoded.id;

    });
}

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
router.get('/admin/get_categories_subCategories', function (req, res) {

    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var token = req.headers.authorization;
        verifyToken(token, res, lang);
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
router.get('/admin/categories', function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {

        var token = req.headers.authorization;
        verifyToken(token, res, lang);

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
router.post('/admin/create', upload.single('image'), async function (req, res) {



    var lang = req.headers.language;
    var credentials = req.body;
    var token = req.headers.authorization;
    verifyToken(token, res, lang);

    var errors = validationResult(req);
    if (errors.array().length == 0) {

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
        const relative_ptah = '/images/categories';
        const imagePath = path.join(__dirname, '..' + relative_ptah);
        const fileUpload = new Resize(imagePath, new Date().toISOString() + '.png');
        const filename = await fileUpload.save(req.file.buffer);


        return new Promise(function (resolve, reject) {

            if (!credentials) {
                languageService.get_lang(lang, 'EMPTY_FIELD_NAME_EN').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.name_en || credentials.name_en == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_NAME_EN').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.name_ar || credentials.name_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_NAME_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.keyword || credentials.keyword == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_KEYWORD').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.short_desc || credentials.short_desc == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else {
                credentials['icon'] = relative_ptah + '/' + filename;
                console.log(JSON.stringify(credentials));
                categoryServices.create_category(credentials).then(category => {
                    resolve(category);
                    if (category == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: category,
                            });
                        })
                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: category,
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
router.post('/admin/update', upload.single('image'), async function (req, res) {

    var lang = req.headers.language;
    var credentials = req.body;
    var token = req.headers.authorization;
    verifyToken(token, res, lang);

    var errors = validationResult(req);
    if (errors.array().length == 0) {

        //check if there is any file update
        if (req.file) {
            const relative_ptah = '/images/categories';
            const imagePath = path.join(__dirname, '..' + relative_ptah);
            const fileUpload = new Resize(imagePath, new Date().toISOString() + '.png');
            const filename = await fileUpload.save(req.file.buffer);
            credentials['icon'] = relative_ptah + '/' + filename;
        }

        return new Promise(function (resolve, reject) {
            if (!credentials || !credentials.shop_category_id || credentials.shop_category_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHOP_CATEGORY_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.name_ar || credentials.name_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_NAME_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.keyword || credentials.keyword == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_KEYWORD').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.short_desc || credentials.short_desc == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_SHORT_DEC').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else {
                console.log(JSON.stringify(credentials));
                categoryServices.update_category(credentials).then(category => {
                    resolve(category);
                    if (category == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: category,
                            });
                        })
                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: category,
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
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var credentials = req.body;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        verifyToken(token, res, lang);
        if (!credentials.shop_category_id || credentials.shop_category_id == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_SHOP_CATEGORY_ID').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                })
            });

        } else {

            return new Promise(function (resolve, reject) {
                categoryServices.delete_category(credentials.shop_category_id).then(response => {
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