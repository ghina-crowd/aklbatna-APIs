var models = require('../models/models.js');
var commonRepository = require('./common.js');
const sequelize = require('sequelize');
const Op = sequelize.Op;
var lang = require('../app');
var kitchens, Meals, Subscription, Category, User;
var SubscriptionsRepository = {

    get: function (subscription_id) {

        if (lang.acceptedLanguage == 'en') {
            Subscription = ['subscription_id', ['title_en', 'title'], ['description_en', 'description'], 'active', 'type', 'status', 'price_monthly', 'price', 'image'];
            kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id', 'busy','is_delivery'];
        } else {
            Subscription = ['subscription_id', ['title_ar', 'title'], ['description_ar', 'description'], 'active', 'type', 'status', 'price_monthly', 'price', 'image'];
            kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id', 'busy','is_delivery'];
        }

        models.Subscription.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' })
        return new Promise(function (resolve, reject) {
            models.Subscription.findOne({
                where: { subscription_id: subscription_id }, include: [{ model: models.kitchens, attributes: kitchens }]
            }).then((Subscriptions => {
                if (Subscriptions == null) {
                    resolve({});
                } else {
                    resolve(Subscriptions);
                }
            }), error => {
                reject(error);
            });
        });
    },



    getAll: function (filters) {


        console.log(filters);

        if (lang.acceptedLanguage == 'en') {
            Subscription = ['subscription_id', ['title_en', 'title'], ['description_en', 'description'], 'type', 'status', 'price_monthly', 'price', 'image'];
            kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id', 'busy','is_delivery'];
        } else {
            Subscription = ['subscription_id', ['title_ar', 'title'], ['description_ar', 'description'], 'type', 'status', 'price_monthly', 'price', 'image'];
            kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id', 'busy','is_delivery'];
        }


        var pageSize = 12; // page start from 0
        const offset = filters.page * pageSize;

        var data = {}
        var dataCate = {}
        data.status = 1;
        if (filters.category_id) {
            dataCate.category_id = filters.category_id
        }
        if (filters.kitchen_id) {
            data.kitchen_id = filters.kitchen_id
        }
        if (filters.type && filters.type !== '0' && filters.type !== 0) {
            data.type = filters.type
        }
        if (filters.keyword) {
            if (lang.acceptedLanguage == 'en') {
                data.title_en = {
                    [Op.like]: '%' + filters.keyword + '%'
                }
            } else {
                data.title_ar = {
                    [Op.like]: '%' + filters.keyword + '%'
                }
            }
        }


        var order = [];

        if (filters.sort_by) {
            if (filters.sort_by == 1) {
                order.push(['price_monthly', 'price', 'ASC'])
            } else if (filters.sort_by == 2) {
                order.push(['price_monthly', 'price', 'DESC'])
            }
        }




        models.Subscription.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' })
        return new Promise(function (resolve, reject) {
            models.Subscription.findAll({
                attributes: Subscription, limit: pageSize, offset: offset, order: order, where: data,
                include: [{ model: models.kitchens, attributes: kitchens, where: dataCate, }]
            }).then((Subscriptions => {
                if (Subscriptions == null) {
                    resolve([]);
                } else {
                    resolve(Subscriptions);
                }
            }), error => {
                reject(error);
            });
        });
    },

    getAllAdmin: function (filters) {


        var pageSize = 12; // page start from 0
        const offset = filters.page * pageSize;

        var data = {}
        var dataCate = {}
        data.status = 1;
        if (filters.category_id) {
            dataCate.category_id = filters.category_id
        }
        if (filters.kitchen_id) {
            data.kitchen_id = filters.kitchen_id
        }
        if (filters.type && filters.type !== '0' && filters.type !== 0) {
            data.type = filters.type
        }
        if (filters.keyword) {
            if (lang.acceptedLanguage == 'en') {
                data.title_en = {
                    [Op.like]: '%' + filters.keyword + '%'
                }
            } else {
                data.title_ar = {
                    [Op.like]: '%' + filters.keyword + '%'
                }
            }
        }


        var order = [];

        if (filters.sort_by) {
            if (filters.sort_by == 1) {
                order.push(['price_monthly', 'price', 'ASC'])
            } else if (filters.sort_by == 2) {
                order.push(['price_monthly', 'price', 'DESC'])
            }
        }




        models.Subscription.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' })
        return new Promise(function (resolve, reject) {
            models.Subscription.findAll({
                limit: pageSize, offset: offset, order: order, where: data,
                include: [{ model: models.kitchens, where: dataCate, }]
            }).then((Subscriptions => {
                if (Subscriptions == null) {
                    resolve([]);
                } else {
                    resolve(Subscriptions);
                }
            }), error => {
                reject(error);
            });
        });
    },


    create: function (newSubscriptionsData) {
        return new Promise(function (resolve, reject) {
            models.Subscription.create({
                title_ar: newSubscriptionsData.title_ar,
                description_ar: newSubscriptionsData.description_ar,
                description_en: newSubscriptionsData.description_en,
                title_en: newSubscriptionsData.title_en,
                type: newSubscriptionsData.type,
                status: newSubscriptionsData.status,
                kitchen_id: newSubscriptionsData.kitchen_id,
                price: newSubscriptionsData.price,
                price_monthly: newSubscriptionsData.price_monthly,
                image: newSubscriptionsData.image
            }).then(Subscriptions => {
                resolve(Subscriptions);
            }, error => {
                reject(error)
            });
        });
    },

    update: function (newSubscriptionsData) {
        return new Promise(function (resolve, reject) {
            models.Subscription.update({
                title_ar: newSubscriptionsData.title_ar,
                description_ar: newSubscriptionsData.description_ar,
                description_en: newSubscriptionsData.description_en,
                title_en: newSubscriptionsData.title_en,
                type: newSubscriptionsData.type,
                status: newSubscriptionsData.status,
                kitchen_id: newSubscriptionsData.kitchen_id,
                price: newSubscriptionsData.price,
                price_monthly: newSubscriptionsData.price_monthly,
                image: newSubscriptionsData.image
            }, { where: { subscription_id: newSubscriptionsData.subscription_id } }).then(Subscriptions => {
                models.Subscription.findOne({ where: { subscription_id: newSubscriptionsData.subscription_id } }).then((Subscription) => {
                    if (Subscription)
                        resolve(Subscription); else resolve({})
                })

            }, error => {
                reject(error)
            });
        });
    },
    delete: function (Subscriptions_id) {
        return new Promise(function (resolve, reject) {
            models.Subscription.destroy({ where: { subscription_id: Subscriptions_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    }
};
Object.assign(SubscriptionsRepository, commonRepository);
module.exports = SubscriptionsRepository;