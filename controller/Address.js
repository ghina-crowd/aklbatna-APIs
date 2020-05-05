var express = require('express');
const { validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var AddressService = require('../service/Address');
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
    var token = req.headers.authorization;
    await verifyToken(token, res, lang);
    if (!id) {
        return;
    }
    if (errors.array().length == 0) {
        var lang = req.headers.language;
        return new Promise(function (resolve, reject) {
            AddressService.get(id).then(cities => {
                resolve(cities);
                if (cities == null) {
                    cities = [];
                }
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: cities
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

                if (!credentials.type || credentials.type == '') {
                    languageService.get_lang(lang, 'EMPTY_FIELD_TYPE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                }
                else
                    if (!credentials.city_id || credentials.city_id == '') {
                        languageService.get_lang(lang, 'EMPTY_FIELD_CITY_ID').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    }
                    else if (!credentials.area || credentials.area == '') {
                        languageService.get_lang(lang, 'EMPTY_FIELD_AREA').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    }
                    // else if (!credentials.street || credentials.street == '') {
                    //     languageService.get_lang(lang, 'EMPTY_FIELD_STREET').then(msg => {
                    //         res.json({
                    //             status: statics.STATUS_FAILURE,
                    //             code: codes.FAILURE,
                    //             message: msg.message,
                    //             data: null
                    //         });
                    //     });
                    // }
                    // else if (!credentials.building || credentials.building == '') {
                    //     languageService.get_lang(lang, 'EMPTY_FIELD_BUILDING').then(msg => {
                    //         res.json({
                    //             status: statics.STATUS_FAILURE,
                    //             code: codes.FAILURE,
                    //             message: msg.message,
                    //             data: null
                    //         });
                    //     });
                    // }
                    // else if (!credentials.phone || credentials.phone == '') {
                    //     languageService.get_lang(lang, 'EMPTY_FIELD_PHONE').then(msg => {
                    //         res.json({
                    //             status: statics.STATUS_FAILURE,
                    //             code: codes.FAILURE,
                    //             message: msg.message,
                    //             data: null
                    //         });
                    //     });
                    // }
                    // else if (credentials.type.toString().toLowerCase() !== 'house' && !credentials.apartment || credentials.apartment == '') {
                    //     languageService.get_lang(lang, 'EMPTY_FIELD_APARTMENT').then(msg => {
                    //         res.json({
                    //             status: statics.STATUS_FAILURE,
                    //             code: codes.FAILURE,
                    //             message: msg.message,
                    //             data: null
                    //         });
                    //     });
                    // }
                    // else if (credentials.type.toString().toLowerCase() !== 'house' && !credentials.floor || credentials.floor == '') {
                    //     languageService.get_lang(lang, 'EMPTY_FIELD_FLOOR').then(msg => {
                    //         res.json({
                    //             status: statics.STATUS_FAILURE,
                    //             code: codes.FAILURE,
                    //             message: msg.message,
                    //             data: null
                    //         });
                    //     });
                    // }
                    else {
                        credentials.user_id = id;
                        console.log(credentials);
                        return new Promise(function (resolve, reject) {
                            AddressService.create(credentials).then(account => {
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

            if (!credentials.address_id || credentials.address_id == '') {
                languageService.get_lang(lang, 'EMPTY_FIELD_ADDRESS_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else {
                return new Promise(function (resolve, reject) {
                    {
                        return new Promise(function (resolve, reject) {
                            AddressService.update(credentials).then(account => {
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
router.delete('/delete/:address_id', async function (req, res) {
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
                    AddressService.delete(req.params.address_id).then(account => {
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

module.exports = router;