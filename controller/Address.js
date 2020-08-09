var express = require('express');
const { validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var AddressService = require('../service/Address');
const jwt = require('jsonwebtoken');
var config = require('../constant/config.js');
var orderservice = require('../service/Order');
var UserService = require('../repository/users');
const multer = require('multer');
var Coupons = require('../repository/Coupons');
var kitchenRepository = require('../repository/Kitchen');
var UserRepository = require('../repository/users');
var Notifications = require('../repository/Notifications');
var Messaging = require('../util/firebase');
const { sendOrderStatus } = require('../util/sendOrderEmails');




const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});



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


router.post('/GuestCreate',
    upload.array('images'), async function (req, res) {
        var lang = req.headers.language;
        var errors = validationResult(req);
        try {
            if (errors.array().length == 0) {
                var credentials = req.body;
                var lang = req.headers.language;

                console.log('credentials', credentials);

                return new Promise(function (resolve, reject) {
                    if (!credentials.email || credentials.email == '') {
                        languageService.get_lang(lang, 'email').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    }
                    else if (!credentials.first_name || credentials.first_name == '') {
                        languageService.get_lang(lang, 'first_name').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    }
                    else if (!credentials.last_name || credentials.last_name == '') {
                        languageService.get_lang(lang, 'last_name').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    }
                    else if (!credentials.type || credentials.type == '') {
                        languageService.get_lang(lang, 'EMPTY_FIELD_TYPE').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    }
                    else if (!credentials.city_id || credentials.city_id == '') {
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
                    } else if (!credentials.SubOrders || credentials.SubOrders.length == 0) {
                        languageService.get_lang(lang, 'NO_MEALS_IN_ORDER').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    } else if (!credentials.total_price || String(credentials.total_price) == '') {
                        languageService.get_lang(lang, 'NO_TOTAL_PRICE').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    } else if (!String(credentials.delivery_charges) || String(credentials.delivery_charges) == '') {
                        languageService.get_lang(lang, 'NO_DELIVERY_CHARGES').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    }
                    else if (!credentials.payment_type || String(credentials.payment_type) == '') {
                        languageService.get_lang(lang, 'NO_PAYMENT_TYPE').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    } else if (!credentials.subtotal || String(credentials.subtotal) == '') {
                        languageService.get_lang(lang, 'NO_SUB_TOTAL').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    } else if (!String(credentials.tax) || String(credentials.tax) == '') {
                        languageService.get_lang(lang, 'NO_TAX').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    }
                    else if (!credentials.discount || String(credentials.discount) == '') {
                        languageService.get_lang(lang, 'NO_DISCOUNT').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: null
                            });
                        });
                    } 
                    else if (!credentials.kitchen_id || String(credentials.kitchen_id) == '') {
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
                        if (!credentials.SubOrders || credentials.SubOrders.length === 0) {
                            languageService.get_lang(lang, 'SUB_ORDER_MISSING').then(msg => {
                                res.json({
                                    status: statics.STATUS_FAILURE,
                                    code: codes.FAILURE,
                                    message: msg.message,
                                    data: null
                                });
                            });
                            return;
                        }

                        credentials.user_id = id;
                        UserService.CreateGuest(credentials.email, credentials.first_name, credentials.last_name, credentials.phone).then((user) => {
                            credentials.user_id = user.dataValues.user_id;
                            return new Promise(function (resolve, reject) {
                              
                                AddressService.create(credentials).then(account => {
                                    credentials.address_id = account.dataValues.address_id;
                                    orderservice.CreateOrder(credentials).then(order => {


                                        if (credentials.coupon || String(credentials.coupon) !== '') {
                                            Coupons.updatemax(credentials.coupon)
                                        }

                                        languageService.get_lang(lang, 'SUCCESS').then(msg => {
                                            res.json({
                                                status: statics.STATUS_SUCCESS,
                                                code: codes.SUCCESS,
                                                message: msg.message,
                                                data: order
                                            });
                                        });
            

                                        //Send notifcation to kitchen owner
                                        kitchenRepository.get(order.kitchen_id).then((kitchen) => {


                                            Notifications.create({
                                                title: 'Order',
                                                message: 'You have new Order please respond',
                                                action: 'Order/details/' + String(order['dataValues'].order_id),
                                                user_id: String(kitchen.dataValues['user'].user_id)

                                            })

                                            var messageObj = {};
                                            messageObj.data = { order_id: String(order['dataValues'].order_id), notifcationType: 'Orders' };
                                            messageObj.title = 'Aklbenta';
                                            messageObj.body = 'You have new Order please respond';
                                            messageObj.to = String(kitchen.dataValues['user'].fcm ? kitchen.dataValues['user'].fcm : 'empity').trim();
                                            messageObj.token = String(kitchen.dataValues['user'].fcm ? kitchen.dataValues['user'].fcm : 'empity').trim();
                                            messageObj.webpush = { headers: { Urgency: 'high' } };
                                            messageObj.notification = {
                                                title: 'Aklbenta', body: 'You have new Order please respond',
                                                clickAction: 'com.crowddigital.aklbetna.ui.splash.SplashActivity',
                                                icon: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg'
                                            };
                                            messageObj.android = { notification: { title: 'Aklbenta', body: 'You have new Order please respond', image: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg' } };

                                            Messaging.sendNotificaitonToSingleUser(messageObj)
                                        })



                                        //Send notifcation to user for confirmation order
                                        UserRepository.getUserByID(order.user_id).then((User) => {

                                            var kitchen = order['dataValues'].Kitchen;
                                            console.log(order.user_id);


                                            Notifications.create({
                                                title: kitchen.dataValues.name,
                                                message: 'Thank you for submitting your request we will get in touch with you shortly',
                                                action: 'Order/details/' + String(order['dataValues'].order_id),
                                                user_id: String(User.user_id)

                                            });

                                            var messageObj = {};
                                            messageObj.data = { order_id: String(order['dataValues'].order_id), notifcationType: 'Orders' };
                                            messageObj.title = kitchen.dataValues.name;
                                            messageObj.body = 'Thank you for submitting your request we will get in touch with you shortly';
                                            messageObj.to = String(User.fcm ? User.fcm : 'empity').trim();
                                            messageObj.token = String(User.fcm ? User.fcm : 'empity').trim();
                                            messageObj.webpush = { headers: { Urgency: 'high' } };
                                            messageObj.notification = {
                                                title: kitchen.dataValues.name, body: 'Thank you for submitting your request we will get in touch with you shortly',
                                                clickAction: 'com.crowddigital.aklbetna.ui.splash.SplashActivity',
                                                icon: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg'
                                            };
                                            messageObj.android = { notification: { title: 'Aklbenta', body: 'Thank you for submitting your request we will get in touch with you shortly', image: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg' } };

                                            Messaging.sendNotificaitonToSingleUser(messageObj);
                                            sendOrderStatus(order, User, 'Thank you for submitting your request we will get in touch with you shortly');




                                        });


                                    }, error => {
                                        reject(error);
                                    }
                                    );
                                },error => {
                                    reject(error);
                                }
                                );
                            });
                        })

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

module.exports = router;