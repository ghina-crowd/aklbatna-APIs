var models = require('../models/models.js');
var commonRepository = require('./common.js');
var MealRepository = require('./Meals');
var kitchenRepository = require('./Kitchen');
var lang = require('../app');
var kitchens, Meals, User, City, Category, Offer, Subs;
const sequelize = require('sequelize');
const Op = sequelize.Op;
const ShortUniqueId = require('short-unique-id').default;
var moment = require('moment');


var OrderRepository = {

    GetAdminOrders: function (filters) {
        var pageSize = 12; // page start from 0
        const offset = filters.page * pageSize;
        var data = {};
        if (filters.startDate && filters.endDate) {
            console.log('we are in date sort')
            console.log(filters.startDate)
            console.log(filters.endDate)
            var start = new Date(filters.startDate).setDate(new Date(filters.startDate).getDate());
            var end = new Date(filters.endDate).setDate(new Date(filters.endDate).getDate() + 1);

            console.log(start)
            console.log(end)
            data.order_timing = {
                [Op.between]: [new Date(start), new Date(end)]
            }
        }
        console.log(data);

        if (filters.kitchen_id) {
            data.kitchen_id = filters.kitchen_id;
        }

        if (filters.status) {
            data.status = filters.status;
        }

        return new Promise(function (resolve, reject) {

            User = ['user_id', 'email', 'first_name', 'phone', 'last_name', 'user_type', 'profile'];

            models.Order.hasMany(models.SubOrder, { foreignKey: 'order_id' });
            models.SubOrder.belongsTo(models.Meals, { foreignKey: 'meal_id' });
            models.Order.belongsTo(models.Address, { foreignKey: 'address_id' });
            models.Address.belongsTo(models.City, { foreignKey: 'city_id' });
            models.Order.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Order.belongsTo(models.User, { foreignKey: 'user_id' });
            models.Order.hasOne(models.Profit, { foreignKey: 'order_id' });


            models.Order.findAndCountAll({
                distinct: true, where: data,
                limit: pageSize, offset: offset,
                include: [
                    { model: models.SubOrder, include: [{ model: models.Meals }] }, { model: models.Address, include: [{ model: models.City }] },
                    { model: models.kitchens },
                    { model: models.User, attributes: User }, { model: models.Profit }
                ]

            }).then(Orders => {



                models.Order.findAll({
                    distinct: true, where: data,
                    include: [
                        { model: models.SubOrder, include: [{ model: models.Meals }] }, { model: models.Address, include: [{ model: models.City }] },
                        { model: models.kitchens },
                        { model: models.User, attributes: User }, { model: models.Profit }
                    ]

                }).then(calculations => {


                    var finalPrice = 0;
                    var finalProfit = 0;
                    var length = 0;
                    calculations.forEach(async order => {
                        finalPrice = finalPrice + Number(Number(order['dataValues'].total_price) + order['dataValues'].delivery_charges)
                        finalProfit = finalProfit + Number(Number(order['dataValues'].Profit['dataValues'].profit))
                        console.log(finalPrice);
                        length = length + 1;
                        console.log(length);

                    });
                    Orders.finalPrice = finalPrice;
                    Orders.finalProfit = finalProfit;

                    var reviewsTemp = Orders.rows;
                    Orders.Orders = reviewsTemp;
                    // Orders.Orders = calculations;

                    delete Orders.rows;
                    resolve(Orders);

                }, error => {
                    reject(error);
                });




                // var reviewsTemp = Orders.rows;
                // Orders.Orders = reviewsTemp;
                // var finalPrice = 0;
                // var finalProfit = 0;
                // Orders.Orders.forEach(async order => {
                //     finalPrice = finalPrice + Number(Number(order['dataValues'].total_price) * order['dataValues'].delivery_charges)
                //     finalProfit = finalProfit + Number(Number(order['dataValues'].Profit['dataValues'].profit))

                // });
                // Orders.finalPrice = finalPrice;
                // Orders.finalProfit = finalProfit;

                // delete Orders.rows;
                // resolve(Orders);

            }, error => {
                reject(error);
            });
        });



    },





    getSpCount: function (user_id, Type) {

        return new Promise(function (resolve, reject) {
            models.Order.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Order.findAll({
                where: { status: Type },
                include: [{
                    required: true,
                    model: models.kitchens, where: {
                        user_id: user_id
                    }
                }]
            }).then((Orders => {
                if (Orders == null) {
                    resolve([]);
                } else {
                    resolve(Orders);
                }
            }), error => {
                reject(error);
            })
        });
    },
    getSpCountAll: function (user_id) {

        return new Promise(function (resolve, reject) {
            models.Order.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Order.findAll({
                include: [{
                    required: true,
                    model: models.kitchens, where: {
                        user_id: user_id
                    }
                }]
            }).then((Orders => {
                if (Orders == null) {
                    resolve([]);
                } else {
                    resolve(Orders);
                }
            }), error => {
                reject(error);
            })
        });
    },


    GetKitchenOrders: function (filters) {
        var pageSize = 12; // page start from 0
        const offset = filters.page * pageSize;
        var data = {};
        if (filters.created_order_date) {
            console.log('we are in date sort')
            console.log(filters.created_order_date)
            var start = new Date(filters.created_order_date).setDate(new Date(filters.created_order_date).getDate());
            var end = new Date(filters.created_order_date).setDate(new Date(filters.created_order_date).getDate() + 1);

            data.date = {
                [Op.gte]: new Date(start),
                [Op.lte]: new Date(end)

            }
        }

        if (filters.kitchen_id) {
            data.kitchen_id = filters.kitchen_id;
        }

        if (filters.status) {
            data.status = filters.status;
        }

        return new Promise(function (resolve, reject) {

            User = ['user_id', 'email', 'first_name', 'phone', 'last_name', 'user_type', 'profile'];

            models.Order.hasMany(models.SubOrder, { foreignKey: 'order_id' });
            models.SubOrder.belongsTo(models.Meals, { foreignKey: 'meal_id' });
            models.Order.belongsTo(models.Address, { foreignKey: 'address_id' });
            models.Address.belongsTo(models.City, { foreignKey: 'city_id' });
            models.Order.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Order.belongsTo(models.User, { foreignKey: 'user_id' });
            models.Order.hasOne(models.Profit, { foreignKey: 'order_id' });


            models.Order.findAndCountAll({
                distinct: true, where: data,
                limit: pageSize, offset: offset,
                include: [
                    { model: models.SubOrder, include: [{ model: models.Meals }] }, { model: models.Address, include: [{ model: models.City }] },
                    { model: models.kitchens },
                    { model: models.User, attributes: User }, { model: models.Profit }
                ]

            }).then(Orders => {


                models.Order.findAll({
                    distinct: true, where: data,
                    include: [
                        { model: models.SubOrder, include: [{ model: models.Meals }] }, { model: models.Address, include: [{ model: models.City }] },
                        { model: models.kitchens },
                        { model: models.User, attributes: User }, { model: models.Profit }
                    ]

                }).then(calculations => {

                    var finalPrice = 0;
                    var finalProfit = 0;
                    calculations.forEach(async order => {
                        finalPrice = finalPrice + Number(Number(order['dataValues'].total_price) + order['dataValues'].delivery_charges)
                        finalProfit = finalProfit + Number(Number(order['dataValues'].Profit['dataValues'].profit))

                    });
                    Orders.finalPrice = finalPrice;
                    Orders.finalProfit = finalProfit;

                    var reviewsTemp = Orders.rows;
                    Orders.Orders = reviewsTemp;
                    // Orders.Orders = calculations;

                    delete Orders.rows;
                    resolve(Orders);

                }, error => {
                    reject(error);
                });



            }, error => {
                reject(error);
            });
        });



    },
    GetAll: function (id, page, sorttype) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;

        var order = [];
        var dataOrder = {};
        var data = {};
        order.push(['order_id', 'DESC'])

        if (id) {
            if (Number(sorttype) == -1) {
                dataOrder.status = {
                    [Op.ne]: Number(sorttype)
                }
            } else {
                dataOrder.status = {
                    [Op.eq]: Number(sorttype)
                }
            }
            console.log(data)
            data = { user_id: id };
            return new Promise(function (resolve, reject) {

                if (lang.acceptedLanguage == 'en') {
                    kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id'];
                    Meals = ['meal_id', ['name_en', 'name'], ['description_en', 'description'], 'menu_id', 'image', 'type', 'price', 'total_served', 'featured'];
                    Offer = ['offer_id', ['title_ar', 'title'], ['description_en', 'description'], 'image', 'meal_id', 'price', 'total_served'];
                    Subs = ['subscription_id', ['title_en', 'title'], ['description_en', 'description'], 'image', 'price', 'price_monthly', 'type', 'total_served'];
                    User = ['user_id', 'email', 'first_name', 'phone', 'last_name', 'user_type', 'profile'];
                    City = ['city_id', ['name_en', 'name']];
                } else {
                    kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id'];
                    Meals = ['meal_id', ['name_ar', 'name'], ['description_en', 'description'], 'menu_id', 'image', 'type', 'price', 'total_served', 'featured'];
                    Offer = ['offer_id', ['title_ar', 'title'], ['description_en', 'description'], 'image', 'price', 'meal_id', 'price', 'total_served'];
                    Subs = ['subscription_id', ['title_ar', 'title'], ['description_ar', 'description'], 'image', 'price', 'price_monthly', 'type', 'total_served'];
                    User = ['user_id', 'email', 'first_name', 'phone', 'last_name', 'user_type', 'profile'];
                    City = ['city_id', ['name_ar', 'name']];
                }

                models.Order.hasMany(models.SubOrder, { foreignKey: 'order_id' });
                models.Order.belongsTo(models.Address, { foreignKey: 'address_id' });
                models.SubOrder.belongsTo(models.Meals, { foreignKey: 'meal_id' });
                models.SubOrder.belongsTo(models.Subscription, { foreignKey: 'subscription_id' });
                models.SubOrder.belongsTo(models.Offers, { foreignKey: 'offer_id' });
                models.Address.belongsTo(models.City, { foreignKey: 'city_id' });
                models.Order.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
                models.kitchens.belongsTo(models.Categories, { foreignKey: 'category_id' });
                models.Order.belongsTo(models.User, { foreignKey: 'user_id' });


                models.Order.findAndCountAll({
                    distinct: true,
                    limit: pageSize, offset: offset, where: dataOrder, order: order,
                    include: [
                        { model: models.SubOrder, include: [{ model: models.Meals, attributes: Meals }, { model: models.Offers, attributes: Offer }, { model: models.Subscription, attributes: Subs }] },
                        { model: models.kitchens, attributes: kitchens, include: [{ model: models.Categories, attributes: Category }] },
                        { model: models.Address, include: [{ model: models.City, attributes: City }] },
                        { model: models.User, attributes: User, where: data },
                    ]
                }).then(Orders => {
                    var reviewsTemp = Orders.rows;
                    Orders.Orders = reviewsTemp;

                    // Orders.Orders.forEach(async order => {
                    //     var totalOrderPrice = 0;
                    //     await order['dataValues'].alkebetna_sub_orders.forEach(subOrders => {
                    //         totalOrderPrice = totalOrderPrice + (Number(subOrders['dataValues'].quantity) * subOrders['dataValues'].Meal['dataValues'].price)
                    //     });
                    //     order['dataValues'].totalPrice = totalOrderPrice;

                    // });

                    delete Orders.rows;
                    resolve(Orders);

                }, error => {
                    reject(error);
                });
            });

        } else {
            return new Promise(function (resolve, reject) {

                User = ['user_id', 'email', 'first_name', 'phone', 'last_name', 'user_type', 'profile'];

                models.Order.hasMany(models.SubOrder, { foreignKey: 'order_id' });
                models.SubOrder.belongsTo(models.Meals, { foreignKey: 'meal_id' });
                models.Order.belongsTo(models.Address, { foreignKey: 'address_id' });
                models.Address.belongsTo(models.City, { foreignKey: 'city_id' });
                models.Order.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
                models.Order.belongsTo(models.User, { foreignKey: 'user_id' });
                models.Order.hasOne(models.Profit, { foreignKey: 'order_id' });


                models.Order.findAndCountAll({
                    distinct: true,
                    limit: pageSize, offset: offset,
                    include: [
                        { model: models.SubOrder, include: [{ model: models.Meals }] }, { model: models.Address, include: [{ model: models.City }] },
                        { model: models.kitchens },
                        { model: models.User, attributes: User }, { model: models.Profit }
                    ]

                }).then(Orders => {
                    var reviewsTemp = Orders.rows;
                    Orders.Orders = reviewsTemp;
                    Orders.Orders.forEach(async order => {
                        var totalOrderPrice = 0;
                        await order['dataValues'].alkebetna_sub_orders.forEach(subOrders => {
                            totalOrderPrice = totalOrderPrice + (Number(subOrders['dataValues'].quantity) * subOrders['dataValues'].Meal['dataValues'].price)
                        });
                        order['dataValues'].totalPrice = totalOrderPrice;

                    });
                    delete Orders.rows;
                    resolve(Orders);

                }, error => {
                    reject(error);
                });
            });
        }

    },
    Get: function (order_id) {

        return new Promise(async function (resolve, reject) {

            if (lang.acceptedLanguage == 'en') {
                kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id'];
                Meals = ['meal_id', ['name_en', 'name'], ['description_en', 'description'], 'menu_id', 'image', 'type', 'price', 'total_served', 'featured'];
                Offer = ['offer_id', ['title_ar', 'title'], ['description_en', 'description'], 'image', 'meal_id', 'price', 'total_served'];
                Subs = ['subscription_id', ['title_en', 'title'], ['description_en', 'description'], 'image', 'price', 'price_monthly', 'type', 'total_served'];
                User = ['user_id', 'email', 'first_name', 'phone', 'last_name', 'user_type', 'profile'];
                City = ['city_id', ['name_en', 'name']];
            } else {
                kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id'];
                Meals = ['meal_id', ['name_ar', 'name'], ['description_en', 'description'], 'menu_id', 'image', 'type', 'price', 'total_served', 'featured'];
                Offer = ['offer_id', ['title_ar', 'title'], ['description_en', 'description'], 'image', 'price', 'meal_id', 'price', 'total_served'];
                Subs = ['subscription_id', ['title_ar', 'title'], ['description_ar', 'description'], 'image', 'price', 'price_monthly', 'type', 'total_served'];
                User = ['user_id', 'email', 'first_name', 'phone', 'last_name', 'user_type', 'profile'];
                City = ['city_id', ['name_ar', 'name']];
            }

            models.Order.hasMany(models.SubOrder, { foreignKey: 'order_id' });
            models.Order.belongsTo(models.Address, { foreignKey: 'address_id' });
            models.SubOrder.belongsTo(models.Meals, { foreignKey: 'meal_id' });
            models.SubOrder.belongsTo(models.Subscription, { foreignKey: 'subscription_id' });
            models.SubOrder.belongsTo(models.Offers, { foreignKey: 'offer_id' });

            models.Address.belongsTo(models.City, { foreignKey: 'city_id' });
            models.Order.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Order.belongsTo(models.User, { foreignKey: 'user_id' });
            models.Order.hasOne(models.Profit, { foreignKey: 'order_id' });

            models.Order.findOne({
                where: { order_id: order_id },
                include: [
                    { model: models.SubOrder, include: [{ model: models.Meals, attributes: Meals }, { model: models.Offers, attributes: Offer }, { model: models.Subscription, attributes: Subs }] },
                    { model: models.kitchens, attributes: kitchens },
                    { model: models.Address, include: [{ model: models.City, attributes: City }] },
                    { model: models.User, attributes: User }, { model: models.Profit }
                ]
            }).then(async Orders => {
                if (Orders == null) {
                    resolve(null);
                } else {
                    var totalOrderPrice = 0;
                    await Orders['dataValues'].alkebetna_sub_orders.forEach(subOrders => {
                        if (subOrders['dataValues'].Meal) {
                            totalOrderPrice = totalOrderPrice + (Number(subOrders['dataValues'].quantity) * subOrders['dataValues'].Meal['dataValues'].price)
                        }
                        if (subOrders['dataValues'].Offer) {
                            totalOrderPrice = totalOrderPrice + (Number(subOrders['dataValues'].quantity) * subOrders['dataValues'].Meal['dataValues'].price)
                        }
                        if (subOrders['dataValues'].Subscription) {
                            // totalOrderPrice = totalOrderPrice + (Number(subOrders['dataValues'].quantity) * subOrders['dataValues'].Meal['dataValues'].price)
                        }
                    });
                    Orders['dataValues'].totalPrice = totalOrderPrice;

                    resolve(Orders);
                }



            }, error => {
                reject(error);
            });
        });

    },
    UpdateOrderStatus: async function (newOrderData) {
        return new Promise(async function (resolve, reject) {
            models.Order.update({
                status: newOrderData.address_id,
                kitchen_id: newOrderData.kitchen_id,
                status: newOrderData.status,
                order_timing: newOrderData.order_timing,
                comments: newOrderData.comments
            }, { where: { order_id: newOrderData.order_id } }).then(async Order => {
                OrderRepository.Get(newOrderData.order_id).then((updatedOrder) => {
                    resolve(updatedOrder);
                })
            }, error => {
                reject(error)
            });
        });
    },
    CreateOrder: async function (newOrderData) {
        const uid = new ShortUniqueId({
            skipShuffle: false, // If true, sequentialUUID will iterate over the dictionary in the given order
            debug: false, // If true the instance will console.log useful info
        });

        return new Promise(async function (resolve, reject) {
            models.Order.create({

                user_id: newOrderData.user_id,
                kitchen_id: newOrderData.kitchen_id,
                address_id: newOrderData.address_id,
                total_price: newOrderData.total_price ? newOrderData.total_price : 0,

                discount: newOrderData.discount ? newOrderData.discount : 0,
                tax: newOrderData.tax ? newOrderData.tax : 0,
                subtotal: newOrderData.subtotal ? newOrderData.subtotal : 0,

                delivery_charges: newOrderData.delivery_charges ? newOrderData.delivery_charges : 0,
                transaction_id: newOrderData.transaction_id ? newOrderData.transaction_id : '',
                payment_type: newOrderData.payment_type ? newOrderData.payment_type : 1,
                status: 0,
                order_timing: newOrderData.order_timing ? moment(new Date(newOrderData.order_timing).getTime()).format('YYYY-MM-DD HH:mm:ss') : moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
                comments: newOrderData.comments ? newOrderData.comments : '',
                os: lang.os ? lang.os : 'old-version',

            }).then(async Order => {

                var transaction_id = uid.randomUUID(6 - String(Order['dataValues'].order_id).length)
                console.log(transaction_id);

                models.Order.update({ transaction_id: String((Order['dataValues'].order_id + transaction_id)) }, { where: { order_id: Order['dataValues'].order_id } }).then(async (Updated) => {
                    console.log(Updated);

                    newOrderData.transaction_id = Order['dataValues'].order_id + transaction_id;
                    newOrderData.order_id = Order['dataValues'].order_id;
                    var subOrders = await OrderRepository.CreateSubOrderMany(newOrderData);
                    Order['dataValues'].subOrders = subOrders;
                    Order['dataValues'].transaction_id = Order['dataValues'].order_id + transaction_id;
                    await OrderRepository.CountForKitchen(newOrderData.kitchen_id);

                    OrderRepository.Get(Order['dataValues'].order_id).then((updatedOrder) => {
                        resolve(updatedOrder);
                    })

                }, error => {
                    reject(error)
                });


            }, error => {
                reject(error)
            });
        });
    },
    UpdateOrder: async function (order_id) {
        return new Promise(async function (resolve, reject) {
            models.Order.update({
                isRate: 1,
            }, { where: { order_id: order_id } }).then(async Order => {
                resolve(Order)
            }, error => {
                reject(error)
            });
        });
    },
    CreateSubOrder: async function (newOrderData) {
        // console.log(newOrderData);

        return new Promise(async function (resolve, reject) {
            models.SubOrder.create({
                meal_id: newOrderData.meal_id ? newOrderData.meal_id : null,
                subscription_id: newOrderData.subscription_id ? newOrderData.subscription_id : null,
                offer_id: newOrderData.offer_id ? newOrderData.offer_id : null,
                order_id: newOrderData.order_id,
                quantity: newOrderData.quantity,
            }).then(async Order => {
                resolve(Order);
            }, error => {
                reject(error)
            });
        });
    },
    CreateSubOrderMany: async function (newOrderData) {
        return new Promise(async function (resolve, reject) {
            var subOrders = [];

            console.log(newOrderData);
            for (let k in newOrderData.SubOrders) {
                var NewSubOrderObject = {};

                if (newOrderData.SubOrders[k].meal_id) {
                    NewSubOrderObject = {
                        meal_id: newOrderData.SubOrders[k].meal_id, order_id: newOrderData.order_id, quantity: newOrderData.SubOrders[k].quantity
                    };
                }

                if (newOrderData.SubOrders[k].subscription_id) {
                    NewSubOrderObject = {
                        subscription_id: newOrderData.SubOrders[k].subscription_id, order_id: newOrderData.order_id, quantity: newOrderData.SubOrders[k].quantity
                    };
                }

                if (newOrderData.SubOrders[k].offer_id) {
                    NewSubOrderObject = {
                        offer_id: newOrderData.SubOrders[k].offer_id, order_id: newOrderData.order_id, quantity: newOrderData.SubOrders[k].quantity
                    };
                }

                console.log(NewSubOrderObject);

                if (NewSubOrderObject.offer_id || NewSubOrderObject.meal_id || NewSubOrderObject.subscription_id)
                    var Order = await OrderRepository.CreateSubOrder(NewSubOrderObject);
                if (newOrderData.SubOrders[k].meal_id)
                    await OrderRepository.CountForMeals(newOrderData.SubOrders[k].meal_id, newOrderData.SubOrders[k].quantity)
                if (newOrderData.SubOrders[k].subscription_id)
                    await OrderRepository.CountForSubscription(newOrderData.SubOrders[k].subscription_id, newOrderData.SubOrders[k].quantity)
                if (newOrderData.SubOrders[k].offer_id)
                    await OrderRepository.CountForOffer(newOrderData.SubOrders[k].offer_id, newOrderData.SubOrders[k].quantity)


                subOrders.push(Order);
            }
            await OrderRepository.MakeProfit(newOrderData.order_id, newOrderData.transaction_id, newOrderData.kitchen_id, newOrderData.total_price, newOrderData.delivery_charges)
            resolve(subOrders);
        });
    },

    MakeProfit: async function (order_id, transaction_id, kitchen_id, total_price, delivery_charges) {
        console.log(total_price);
        console.log(delivery_charges);
        var profit = Number(total_price);
        profit = (profit * 0.25) + Number(delivery_charges);
        models.Profit.create(
            { order_id: order_id, kitchen_id: kitchen_id, profit: profit, transaction_id: transaction_id }
        ).then(function (result) {
            console.log(result.dataValues)
        }, function (error) {
            reject(error);
        });
    },
    CountForMeals: async function (meal_id, quantity) {

        return new Promise(async function (resolve, reject) {
            models.Meals.findOne({
                attributes: ['total_served']
                , where: { meal_id: meal_id }
            }).then(total_served => {
                if (total_served == null) {
                    resolve(null);
                } else {
                    var count = total_served.dataValues.total_served + 1;
                    models.Meals.update(
                        { total_served: count }, { where: { meal_id: meal_id } }
                    ).then(function (result) {
                        resolve(result);
                    }, function (error) {
                        reject(error);
                    });
                }
            }, error => {
                reject(error);
            });
        });


    },
    CountForOffer: async function (offer_id, quantity) {

        return new Promise(async function (resolve, reject) {
            models.Offers.findOne({
                attributes: ['total_served']
                , where: { offer_id: offer_id }
            }).then(total_served => {
                if (total_served == null) {
                    resolve(null);
                } else {
                    var count = total_served.dataValues.total_served + 1;
                    models.Offers.update(
                        { total_served: count }, { where: { offer_id: offer_id } }
                    ).then(function (result) {
                        resolve(result);
                    }, function (error) {
                        reject(error);
                    });
                }
            }, error => {
                reject(error);
            });
        });


    },
    CountForSubscription: async function (subscription_id, quantity) {

        return new Promise(async function (resolve, reject) {
            models.Subscription.findOne({
                attributes: ['total_served']
                , where: { subscription_id: subscription_id }
            }).then(total_served => {
                if (total_served == null) {
                    resolve(null);
                } else {
                    var count = total_served.dataValues.total_served + 1;
                    models.Subscription.update(
                        { total_served: count }, { where: { subscription_id: subscription_id } }
                    ).then(function (result) {
                        resolve(result);
                    }, function (error) {
                        reject(error);
                    });
                }
            }, error => {
                reject(error);
            });
        });


    },
    CountForKitchen: async function (kitchen_id) {


        return new Promise(async function (resolve, reject) {
            models.kitchens.findOne({
                attributes: ['served_count']
                , where: { kitchen_id: kitchen_id }
            }).then(served_count => {
                if (served_count == null) {
                    resolve(null);
                } else {
                    var count = served_count.dataValues.served_count + 1;
                    models.kitchens.update(
                        { served_count: count }, { where: { kitchen_id: kitchen_id } }
                    ).then(function (result) {
                        resolve(result);
                    }, function (error) {
                        reject(error);
                    });
                }
            }, error => {
                reject(error);
            });
        });




    },
    leaveReview: async function (body) {
        return new Promise(async function (resolve, reject) {
            for (let k in body.meals_rates) {
                body.meals_rates[k].user_id = body.user_id;
                await MealRepository.create_review(body.meals_rates[k])
            }
            await OrderRepository.UpdateOrder(body.order_id);
            kitchenRepository.create_review(body).then((response) => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });

    },
    DeleteOrder: function (order_id) {
        return new Promise(function (resolve, reject) {
            models.Order.destroy({ where: { order_id: order_id } }).then(response => {
                if (response) {
                    resolve(null);
                } else {
                    models.SubOrder.destroy({ where: { order_id: order_id } }).then(response => {
                        if (response) {
                            resolve(null);
                        } else {
                            resolve(response);
                        }
                    }, error => {
                        reject(error);
                    });
                }
            }, error => {
                reject(error);
            });
        });
    }

};
Object.assign(OrderRepository, commonRepository);
module.exports = OrderRepository;