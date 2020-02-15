var models = require('../models/models.js');
var commonRepository = require('./common.js');

var lang = require('../app');
var kitchens, Meals, Menu;
const sequelize = require('sequelize');
const Op = sequelize.Op;

var KitchenRepository = {
    getAll: function () {
        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', 'category_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate'];
            Meals = ['meal_id', ['name_en', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_en', 'name'], 'active'];
        } else {
            kitchens = ['kitchen_id', 'category_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate'];
            Meals = ['meal_id', ['name_ar', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_ar', 'name'], 'active'];
        }
        return new Promise(function (resolve, reject) {
            models.kitchens.findAll({
                attributes: kitchens, where: { active: 1 }
            }).then((kitchens => {
                if (kitchens == null) {
                    resolve([]);
                } else {
                    resolve(kitchens);
                }
            }), error => {
                reject(error);
            })
        });
    },

    get_featured: function (page) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;
        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate'];
            Meals = ['meal_id', ['name_en', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_en', 'name'], 'active'];
        } else {
            kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate'];
            Meals = ['meal_id', ['name_ar', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_ar', 'name'], 'active'];
        }
        models.Menu.hasMany(models.Meals, { foreignKey: 'menu_id' });
        models.kitchens.hasMany(models.Menu, { foreignKey: 'kitchen_id' });
        return new Promise(function (resolve, reject) {
            models.kitchens.findAll({
                attributes: kitchens, limit: pageSize, offset: offset, where: { featured: 1 }, include: [{
                    model: models.Menu,
                    attributes: Menu,
                    where: { active: 1 }, include: [{
                        model: models.Meals,
                        attributes: Meals,
                        where: { active: 1 }
                    }]
                }]
            }).then((kitchens => {
                if (kitchens == null) {
                    resolve([]);
                } else {
                    resolve(kitchens);
                }
            }), error => {
                reject(error);
            })
        });
    },
    get: function (kitchen_id) {

        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate'];
            Meals = ['meal_id', ['name_en', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served'];
            Menu = ['menu_id', ['name_en', 'name'], 'active'];
        } else {
            kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate'];
            Meals = ['meal_id', ['name_ar', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served'];
            Menu = ['menu_id', ['name_ar', 'name'], 'active'];
        }

        console.log(kitchen_id)

        models.kitchens.hasMany(models.Menu, { foreignKey: 'kitchen_id' });
        models.Menu.hasMany(models.Meals, { foreignKey: 'menu_id' });
        models.kitchens.belongsTo(models.User, { foreignKey: 'user_id' });
        return new Promise(function (resolve, reject) {
            models.kitchens.findOne({
                include: [{
                    model: models.Menu,
                    attributes: Menu,
                    required: false,
                    where: { active: 1 }, include: [{
                        required: false,
                        model: models.Meals,
                        attributes: Meals,
                        where: { active: 1 }
                    }]
                }, { model: models.User, }],
                attributes: kitchens, where: { kitchen_id: kitchen_id }
            }).then((kitchens => {
                if (kitchens == null) {
                    resolve({});
                } else {

                    models.Reviews.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'user_id' });
                    models.Reviews.findAll({
                        limit: 4, order: [['date', 'DESC']],
                        where: { kitchen_id: kitchen_id },
                        include: [{
                            model: models.User
                        }],

                    }).then(rating => {
                        kitchens.dataValues['reviews'] = rating;
                        resolve(kitchens);
                    });


                }
            }), error => {
                reject(error);
            })
        });
    },

    create: function (newKitchen) {
        return new Promise(function (resolve, reject) {
            models.kitchens.create({
                name_ar: newKitchen.name_ar,
                name_en: newKitchen.name_en,
                category_id: newKitchen.category_id,
                image: newKitchen.image,
                description_ar: newKitchen.description_ar,
                description_en: newKitchen.description_en,
                start_time: newKitchen.start_time,
                end_time: newKitchen.end_time,
                user_id: newKitchen.user_id,
                served_count: 0,
                final_rate: 0,
                active: 1,
            }).then(contact => {
                resolve(contact);
            }, error => {
                reject(error)
            });
        });
    },
    update: function (newKitchen) {
        return new Promise(function (resolve, reject) {
            models.kitchens.update({
                name_ar: newKitchen.name_ar,
                name_en: newKitchen.name_en,
                category_id: newKitchen.category_id,
                image: newKitchen.image,
                description_ar: newKitchen.description_ar,
                description_en: newKitchen.description_en,
                start_time: newKitchen.start_time,
                end_time: newKitchen.end_time,
                user_id: newKitchen.user_id,
            }, { where: { kitchen_id: newKitchen.kitchen_id } }).then(contact => {
                resolve(contact);
            }, error => {
                reject(error)
            });
        });
    },


    delete: function (kitchen_id) {
        return new Promise(function (resolve, reject) {
            models.kitchens.destroy({ where: { kitchen_id: kitchen_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },
    get_Reviews: function (page, kitchen_id) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;
        return new Promise(function (resolve, reject) {
            models.Reviews.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'user_id' });
            models.Reviews.findAndCountAll({
                limit: pageSize,
                offset: offset,
                order: [['date', 'DESC']],
                where: { kitchen_id: kitchen_id },
                include: [{
                    model: models.User,
                    required: false,
                    attributes: ['user_id', 'first_name', 'last_name', 'profile', 'email']
                }],
            }).then(reviews => {
                if (reviews == null) {
                    resolve(null);
                } else {
                    var reviewsTemp = reviews.rows;
                    reviews.reviews = reviewsTemp;
                    delete reviews.rows;
                    resolve(reviews);
                }
            }, error => {
                reject(error);
            });
        });
    },
    create_review: function (newReviewData) {

        return new Promise(function (resolve, reject) {
            models.Reviews.create({
                user_id: newReviewData.user_id,
                kitchen_id: newReviewData.kitchen_id,
                quality_rate: Number(newReviewData.quality_rate),
                order_pakaging_rate: Number(newReviewData.order_pakaging_rate),
                value_rate: Number(newReviewData.value_rate),
                delivery_rate: Number(newReviewData.delivery_rate),
                final_rate: (Number((Number(newReviewData.quality_rate) + Number(newReviewData.order_pakaging_rate) + Number(newReviewData.value_rate) + Number(newReviewData.delivery_rate)) / 4)),
                comment: newReviewData.comment,
            }).then(rate => {
                if (rate == null) {
                    resolve(null);
                } else {
                    resolve(rate);
                    models.Reviews.findAll({
                        attributes: ['kitchen_id', [sequelize.fn('SUM', sequelize.col('final_rate')), 'sum_rate'],
                            [sequelize.fn('COUNT', sequelize.col('final_rate')), 'count_rate'],
                            [sequelize.fn('SUM', sequelize.col('quality_rate')), 'sum_quality_rate'],
                            [sequelize.fn('SUM', sequelize.col('order_pakaging_rate')), 'sum_order_pakaging_rate'],
                            [sequelize.fn('SUM', sequelize.col('value_rate')), 'sum_value_rate'],
                            [sequelize.fn('SUM', sequelize.col('delivery_rate')), 'sum_delivery_rate']]
                        , where: { kitchen_id: newReviewData.kitchen_id }
                    }).then(Reviews => {
                        if (Reviews == null) {
                            resolve(null);
                        } else {

                            var final_rate = Reviews[0].dataValues['sum_rate'] / Reviews[0].dataValues['count_rate'];
                            final_rate = final_rate.toFixed(1);


                            var sum_quality_rate = Reviews[0].dataValues['sum_quality_rate'] / Reviews[0].dataValues['count_rate'];
                            sum_quality_rate = sum_quality_rate.toFixed(1);

                            var sum_order_pakaging_rate = Reviews[0].dataValues['sum_order_pakaging_rate'] / Reviews[0].dataValues['count_rate'];
                            sum_order_pakaging_rate = sum_order_pakaging_rate.toFixed(1);

                            var sum_value_rate = Reviews[0].dataValues['sum_value_rate'] / Reviews[0].dataValues['count_rate'];
                            sum_value_rate = sum_value_rate.toFixed(1);

                            var sum_delivery_rate = Reviews[0].dataValues['sum_delivery_rate'] / Reviews[0].dataValues['count_rate'];
                            sum_delivery_rate = sum_delivery_rate.toFixed(1);


                            models.kitchens.update(
                                { final_rate: final_rate, final_quality_rate: sum_quality_rate, final_order_pakaging_rate: sum_order_pakaging_rate, final_value_rate: sum_value_rate, final_delivery_rate: sum_delivery_rate }, { where: { kitchen_id: newReviewData.kitchen_id } }
                            ).then(function (result) {
                                resolve(result);
                            }, function (error) {
                                reject(error);
                            });
                        }
                    }, error => {
                        reject(error);
                    });
                }
            }, error => {
                console.log(error)
                reject(error);
            });
        });
    },

};
Object.assign(KitchenRepository, commonRepository);
module.exports = KitchenRepository;