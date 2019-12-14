var express = require('express');
const { validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var companyService = require('../service/company');
var router = express.Router();
var config = require('../constant/config.js');
const path = require('path');
const Resize = require('../util/Resize');
const multer = require('multer');

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


// get filter of all companies with their companies
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
                companyService.filter_companies(latitude, longitude, location_name, page).then(companies => {
                    resolve(companies);
                    if (companies == null) {
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
                                data: companies,
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

//get companies by admin
router.get('/admin/get_companies', function (req, res) {

    var errors = validationResult(req);
    if (errors.array().length == 0) {

        var lang = req.headers.language;
        var token = req.headers.authorization;
        verifyToken(token, res, lang);


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
                companyService.get_companies(page, keyword).then(companies => {
                    resolve(companies);
                    if (companies == null) {
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
                                data: companies,
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
router.post('/admin/create', upload.single('icon'), async function (req, res) {


    var lang = req.headers.language;
    var credentials = req.body;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var token = req.headers.authorization;
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
        const relative_ptah = '/images/companies/';
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
            } else if (!credentials.user_id || credentials.user_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_USER_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.company_name_en || credentials.company_name_en == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_COMPANY_NAME_EN').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.company_name_ar || credentials.company_name_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_COMPANY_NAME_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.description_en || credentials.description_en == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_DEC_EN').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.description_ar || credentials.description_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_DEC_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.latitude || credentials.latitude == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_LATITUDE').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.longitude || credentials.longitude == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_LONGITUDE').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.location_name || credentials.location_name == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_LOCATION').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.website_link || credentials.website_link == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_WEBSITE_LINK').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else {
                credentials['icon'] = relative_ptah + filename;
                console.log(JSON.stringify(credentials));
                companyService.create_company(credentials).then(company => {
                    resolve(company);
                    if (company == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: company,
                            });
                        })
                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: company,
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
router.post('/admin/update', upload.single('icon'), async function (req, res) {


    var lang = req.headers.language;
    var credentials = req.body;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var token = req.headers.authorization;
        verifyToken(token, res, lang);

        //check if there is any file update
        if (req.file) {
            const relative_ptah = '/images/companies/';
            const imagePath = path.join(__dirname, '..' + relative_ptah);
            const fileUpload = new Resize(imagePath, new Date().toISOString() + '.png');
            const filename = await fileUpload.save(req.file.buffer);
            credentials['icon'] = relative_ptah + filename;
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
            } else if (!credentials.company_id || credentials.company_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_COMPANY_ID').then(msg => {
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
            } else if (!credentials.company_name_en || credentials.company_name_en == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_COMPANY_NAME_EN').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.company_name_ar || credentials.company_name_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_COMPANY_NAME_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.description_en || credentials.description_en == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_DEC_EN').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.description_ar || credentials.description_ar == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_DEC_AR').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.latitude || credentials.latitude == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_LATITUDE').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.longitude || credentials.longitude == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_LONGITUDE').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.location_name || credentials.location_name == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_LOCATION').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.website_link || credentials.website_link == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_WEBSITE_LINK').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else {

                console.log(JSON.stringify(credentials));
                companyService.update_company(credentials).then(company => {
                    resolve(company);
                    if (company == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: company,
                            });
                        })
                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: company,
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

        if (!credentials.company_id || credentials.company_id == '') {
            languageService.get_lang(lang, 'EMPTY_FIELD_COMPANY_ID').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                })
            });

        } else {
            return new Promise(function (resolve, reject) {
                companyService.delete_company(credentials.company_id).then(response => {
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