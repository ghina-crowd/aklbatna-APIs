var express = require('express');
const { validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
var orderservice = require('../service/Order');
var Messaging = require('../util/firebase');
const jwt = require('jsonwebtoken');
var config = require('../constant/config.js');
const multer = require('multer');
var kitchenRepository = require('../repository/Kitchen');
var UserRepository = require('../repository/users');
const { sendOrderStatus } = require('../util/sendOrderEmails');
var Coupons = require('../repository/Coupons');
var Notifications = require('../repository/Notifications');

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


router.post('/kitchen/get', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        if (!req.body.page || !req.body.page < 0) {
            languageService.get_lang(lang, 'MISSING_PAGE_NUMBER').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: [],
                })
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                orderservice.GetKitchenOrders(req.body).then(orders => {
                    resolve(orders);
                    languageService.get_lang(lang, 'SUCCESS').then(msg => {
                        res.json({
                            status: statics.STATUS_SUCCESS,
                            code: codes.SUCCESS,
                            message: msg.message,
                            data: orders
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
router.post('/admin/get', async function (req, res) {
    lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var lang = req.headers.language;

        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        if (!req.body.page || !req.body.page < 0) {
            languageService.get_lang(lang, 'MISSING_PAGE_NUMBER').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: [],
                })
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                orderservice.GetAdminOrders(req.body).then(orders => {
                    resolve(orders);
                    languageService.get_lang(lang, 'SUCCESS').then(msg => {
                        res.json({
                            status: statics.STATUS_SUCCESS,
                            code: codes.SUCCESS,
                            message: msg.message,
                            data: orders
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

router.get('/get/:page/:sorttype', async function (req, res) {
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
            orderservice.GetAllOrder(id, req.params.page, req.params.sorttype).then(orders => {
                resolve(orders);
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: orders
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
router.get('/get/:order_id', async function (req, res) {
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
            orderservice.Get(req.params.order_id).then(orders => {
                resolve(orders);
                languageService.get_lang(lang, 'SUCCESS').then(msg => {
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: orders
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
router.put('/update', async function (req, res) {
    var lang = req.headers.language;
    var errors = validationResult(req);
    if (errors.array().length == 0) {

        var credentials = req.body;
        var lang = req.headers.language;
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }


        return new Promise(function (resolve, reject) {

            if (!credentials.address_id || credentials.address_id == '') {
                languageService.get_lang(lang, 'INVALID_ADDRESS_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.kitchen_id || credentials.kitchen_id == '') {
                languageService.get_lang(lang, 'INVALID_KITCHEN_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else if (!credentials.kitchen_id || credentials.kitchen_id == '') {
                languageService.get_lang(lang, 'INVALID_KITCHEN_ID').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });
            } else if (!credentials.status || credentials.status == '') {
                languageService.get_lang(lang, 'INVALID_ORDER_STATUS').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                        data: null
                    });
                });

            } else {
                return new Promise(function (resolve, reject) {
                    orderservice.UpdateOrder(credentials).then(order => {



                        if (String(credentials.status) === '1') {
                            //Send notifcation to user for confirmation order
                            UserRepository.getUserByID(order.user_id).then((User) => {
                                var kitchen = order['dataValues'].Kitchen;

                                Notifications.create({
                                    title: kitchen.dataValues.name,
                                    message: 'Congratulations your order is being processed',
                                    action: 'Order/details/' + String(order['dataValues'].order_id),
                                    user_id: String(order.user_id)

                                });

                                var messageObj = {};
                                messageObj.data = { order_id: String(order['dataValues'].order_id), notifcationType: 'Orders' };
                                messageObj.title = kitchen.dataValues.name;
                                messageObj.body = 'Congratulations your order is being processed';
                                messageObj.to = String(User.fcm).trim();
                                messageObj.token = String(User.fcm).trim();
                                messageObj.webpush = { headers: { Urgency: 'high' } };
                                messageObj.notification = {
                                    title: kitchen.dataValues.name, body: 'Congratulations your order is being processed',
                                    clickAction: 'order/' + String(order['dataValues'].order_id),
                                    icon: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg'
                                };
                                messageObj.android = { notification: { title: kitchen.dataValues.name, body: 'Congratulations your order is being processed', image: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg' } };

                                Messaging.sendNotificaitonToSingleUser(messageObj)
                                sendOrderStatus(order, User, 'Congratulations your order is being processed');
                            })



                        }

                        if (String(credentials.status) === '2') {



                            //Send notifcation to user for confirmation order
                            UserRepository.getUserByID(order.user_id).then((User) => {
                                var kitchen = order['dataValues'].Kitchen;

                                console.log(kitchen.dataValues.name);

                                Notifications.create({
                                    title: kitchen.dataValues.name,
                                    message: 'Your order is shipped and marked as completed',
                                    action: 'Order/details/' + String(order['dataValues'].order_id),
                                    user_id: String(order.user_id)

                                });

                                var messageObj = {};
                                messageObj.data = { order_id: String(order['dataValues'].order_id), notifcationType: 'Orders' };
                                messageObj.title = kitchen.dataValues.name;
                                messageObj.body = 'Your order is shipped and marked as completed';
                                messageObj.to = String(User.fcm).trim();
                                messageObj.token = String(User.fcm).trim();
                                messageObj.webpush = { headers: { Urgency: 'high' } };
                                messageObj.notification = {
                                    title: kitchen.dataValues.name, body: 'Your order is shipped and marked as completed',
                                    clickAction: 'order/' + String(order['dataValues'].order_id),
                                    icon: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg'
                                };
                                messageObj.android = { notification: { title: kitchen.dataValues.name, body: 'Your order is shipped and marked as completed', image: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg' } };

                                Messaging.sendNotificaitonToSingleUser(messageObj);

                                sendOrderStatus(order, User, 'Your order is shipped and marked as completed');




                            })

                        }

                        if (String(credentials.status) === '3') {
                            //Send notifcation to user for confirmation order
                            UserRepository.getUserByID(order.user_id).then((User) => {
                                var kitchen = order['dataValues'].Kitchen;

                                Notifications.create({
                                    title: kitchen.dataValues.name,
                                    message: 'Your cancellation request has been completed',
                                    action: 'Order/details/' + String(order['dataValues'].order_id),
                                    user_id: String(order.user_id)

                                });

                                var messageObj = {};
                                messageObj.data = { order_id: String(order['dataValues'].order_id), notifcationType: 'Orders' };
                                messageObj.title = kitchen.dataValues.name;
                                messageObj.body = 'Your cancellation request has been completed';
                                messageObj.to = String(User.fcm).trim();
                                messageObj.token = String(User.fcm).trim();
                                messageObj.webpush = { headers: { Urgency: 'high' } };
                                messageObj.notification = {
                                    title: kitchen.dataValues.name, body: 'Your cancellation request has been completed',
                                    clickAction: 'order/' + String(order['dataValues'].order_id),
                                    icon: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg'
                                };
                                messageObj.android = { notification: { title: kitchen.dataValues.name, body: 'Your cancellation request has been completed', image: 'https://cdn.imgbin.com/16/14/1/imgbin-macintosh-apple-icon-format-icon-apple-grey-logo-apple-brand-logo-wAqGEYmfuLSPb5yDsiSKzyfgJ.jpg' } };

                                Messaging.sendNotificaitonToSingleUser(messageObj)
                                sendOrderStatus(order, User, 'Your cancellation request has been completed');
                            })

                        }


                        resolve(order);
                        languageService.get_lang(lang, 'SUCCESS').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: order
                            });
                        });
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
});

router.post('/create',
    upload.array('images'),
    async function (req, res) {
        var lang = req.headers.language;
        var errors = validationResult(req);
        if (errors.array().length == 0) {

            var credentials = req.body;
            var lang = req.headers.language;
            var token = req.headers.authorization;
            await verifyToken(token, res, lang);
            if (!id) {
                return;
            }


            return new Promise(function (resolve, reject) {

                if (!credentials.address_id || credentials.address_id == '') {
                    languageService.get_lang(lang, 'INVALID_ADDRESS_ID').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else if (!credentials.kitchen_id || credentials.kitchen_id == '') {
                    languageService.get_lang(lang, 'INVALID_KITCHEN_ID').then(msg => {
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
                else if (!credentials.subtotal || String(credentials.subtotal) == '') {
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
                else if (!credentials.payment_type || String(credentials.payment_type) == '') {
                    languageService.get_lang(lang, 'NO_PAYMENT_TYPE').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: null
                        });
                    });
                } else {

                    credentials.user_id = id;
                    return new Promise(function (resolve, reject) {
                        orderservice.CreateOrder(credentials).then(order => {

                            languageService.get_lang(lang, 'SUCCESS').then(msg => {
                                res.json({
                                    status: statics.STATUS_SUCCESS,
                                    code: codes.SUCCESS,
                                    message: msg.message,
                                    data: order
                                });
                            });


                            if (credentials.coupon || String(credentials.coupon) !== '') {
                                Coupons.updatemax(credentials.coupon)
                            }

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
    });


router.post('/leavereivew',
    upload.array('images'),
    async function (req, res) {
        lang = req.headers.language;
        var errors = validationResult(req);
        if (errors.array().length == 0) {
            var lang = req.headers.language;
            var token = req.headers.authorization;
            await verifyToken(token, res, lang);
            if (!id) {
                return;
            }
            var credentials = req.body;
            if (!credentials.order_id || credentials.order_id == '') {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: 'INVALID_ORDER_ID',
                    data: null
                });
                return;
            }

            // if (!credentials.driver_id || credentials.driver_id == '') {
            //     res.json({
            //         status: statics.STATUS_FAILURE,
            //         code: codes.FAILURE,
            //         message: 'INVALID_DRIVER_ID',
            //         data: null
            //     });
            //     return;
            // }


            // if (!credentials.driverRate || credentials.driverRate == '') {
            //     res.json({
            //         status: statics.STATUS_FAILURE,
            //         code: codes.FAILURE,
            //         message: 'INVALID_DRIVER_RATE',
            //         data: null
            //     });
            //     return;
            // }


            if (!credentials.kitchen_id || credentials.kitchen_id == '') {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: 'INVALID_KITCHEN_ID',
                    data: null
                });
                return;
            }


            if (!credentials.order_pakaging_rate || credentials.order_pakaging_rate == '') {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: 'INVALID_PACKAGINIG_RATE',
                    data: null
                });
                return;
            }

            if (!credentials.delivery_rate || credentials.delivery_rate == '') {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: 'INVALID_DELIVERY_TIME_RATE',
                    data: null
                });
                return;
            }


            if (!credentials.value_rate || credentials.value_rate == '') {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: 'INVALID_VALUE_OF_MONEY_RATE',
                    data: null
                });
                return;
            }

            if (!credentials.quality_rate || credentials.quality_rate == '') {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: 'INVALID_QUANTITY_OF_FOOD_RATE',
                    data: null
                });
                return;
            }

            if (!credentials.meals_rates) {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: 'PLEASE_RATE_MEALS',
                    data: null
                });
                return;
            }

            credentials.user_id = id;
            return new Promise(function (resolve, reject) {
                orderservice.leaveReview(credentials).then(response => {
                    resolve(response);
                    if (response == null) {
                        languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.FAILURE,
                                message: msg.message,
                                data: response
                            });
                        });
                    } else {
                        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: msg.message,
                                data: response
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
router.delete('/admin/delete/:order_id', async function (req, res) {
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
            console.log(req.params.order_id);
            orderservice.DeleteOrder(req.params.order_id).then(response => {
                resolve(response);
                if (response == null) {
                    languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: msg.message,
                            data: response
                        });
                    });
                } else {
                    languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                        res.json({
                            status: statics.STATUS_SUCCESS,
                            code: codes.SUCCESS,
                            message: msg.message,
                            data: response
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