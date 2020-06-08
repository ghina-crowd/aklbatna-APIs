var models = require('../models/models.js');
var commonRepository = require('./common.js');
var UserRepository = require('./users');

var lang = require('../app');
const sequelize = require('sequelize');
const Op = sequelize.Op;
var bcrypt = require('bcryptjs');

var kitchens, Meals, Menu, Category, User;

var KitchenRepository = {


    getAllAdmin: function (filters) {


        console.log(filters)

        var pageSize = 12; // page start from 0
        const offset = filters.page * pageSize;

        var data = {}

        if (filters.category_id) {
            data.category_id = filters.category_id
        }
        if (filters.keyword) {
            if (lang.acceptedLanguage == 'en') {
                data.name_en = {
                    [Op.like]: '%' + filters.keyword + '%'
                }
            } else {
                data.name_ar = {
                    [Op.like]: '%' + filters.keyword + '%'
                }
            }
        }
        return new Promise(function (resolve, reject) {
            models.kitchens.findAndCountAll({
                limit: pageSize, offset: offset, where: data,
            }).then((kitchens => {
                if (kitchens == null) {
                    resolve([]);
                } else {
                    var Temp = kitchens.rows;
                    kitchens.kitchens = Temp;
                    delete kitchens.rows;
                    resolve(kitchens);
                }
            }), error => {
                reject(error);
            })
        });
    },
    getAll: function () {
        if (lang.acceptedLanguage == 'en') {
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery'];
            Meals = ['meal_id', ['name_en', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_en', 'name'], 'active'];
        } else {
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
            kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery'];
            Meals = ['meal_id', ['name_ar', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_ar', 'name'], 'active'];
        }
        return new Promise(function (resolve, reject) {
            models.kitchens.findAll({
                attributes: kitchens, where: { active: 1 }, order: [['kitchen_id', 'DESC']]
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
    getAllCount: function () {

        return new Promise(function (resolve, reject) {
            models.kitchens.findAll().then((kitchens => {
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
    getAllCountActive: function () {

        return new Promise(function (resolve, reject) {
            models.kitchens.findAll({ where: { active: 1 } }).then((kitchens => {
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
    getAllCountUnactive: function () {

        return new Promise(function (resolve, reject) {
            models.kitchens.findAll({ where: { active: 0 } }).then((kitchens => {
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
    getByCategoryID: function (category_id) {
        if (lang.acceptedLanguage == 'en') {
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery'];
            Meals = ['meal_id', ['name_en', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_en', 'name'], 'active'];
        } else {
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
            kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery'];
            Meals = ['meal_id', ['name_ar', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_ar', 'name'], 'active'];
        }
        return new Promise(function (resolve, reject) {
            models.kitchens.findAll({
                attributes: kitchens, where: { active: 1, category_id: category_id }
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
    getAllByLocation: function (body) {

        console.log(body)

        var pageSize = 12; // page start from 0
        const offset = body.page * pageSize;

        if (lang.acceptedLanguage == 'en') {
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'lat', 'lng', 'busy', 'is_delivery'];
            Meals = ['meal_id', ['name_en', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_en', 'name'], 'active'];
        } else {
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
            kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'lat', 'lng', 'busy', 'is_delivery'];
            Meals = ['meal_id', ['name_ar', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_ar', 'name'], 'active'];
        }

        var data = {}

        if (body.keyword) {
            if (lang.acceptedLanguage == 'en') {
                data.name_en = {
                    [Op.like]: '%' + body.keyword + '%'
                }
            } else {
                data.name_ar = {
                    [Op.like]: '%' + body.keyword + '%'
                }
            }
        }




        models.kitchens.belongsTo(models.Categories, { foreignKey: 'category_id' });
        return new Promise(function (resolve, reject) {
            models.kitchens.findAndCountAll({
                limit: pageSize, offset: offset, where: data,
                attributes: kitchens, where: { active: 1 }, include: [{ model: models.Categories, attributes: Category }]
            }).then((kitchens => {
                if (kitchens == null) {
                    resolve([]);
                } else {
                    var sorted_kitchens = [];
                    kitchens.rows.forEach(item => {
                        var distance = calcDistance(item["dataValues"].lat, item["dataValues"].lng, body.lat, body.lng);
                        item["dataValues"].distance = distance;
                        sorted_kitchens.push(item);

                    });


                    sorted_kitchens.sort((a, b) => parseFloat(a["dataValues"].distance) - parseFloat(b["dataValues"].distance));
                    kitchens.kitchens = sorted_kitchens;
                    delete kitchens.rows;
                    resolve(kitchens)
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
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id', 'busy', 'is_delivery'];
            Meals = ['meal_id', ['name_en', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_en', 'name'], 'active'];
            User = ['user_id', 'email', 'first_name', 'phone', 'last_name', 'user_type', 'profile'];

        } else {
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
            kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id', 'busy', 'is_delivery'];
            Meals = ['meal_id', ['name_ar', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_ar', 'name'], 'active'];
            User = ['user_id', 'email', 'first_name', 'phone', 'last_name', 'user_type', 'profile'];

        }
        models.kitchens.belongsTo(models.Categories, { foreignKey: 'category_id' });
        models.kitchens.belongsTo(models.User, { foreignKey: 'user_id' });
        return new Promise(function (resolve, reject) {
            models.kitchens.findAll({
                attributes: kitchens, limit: pageSize, offset: offset, where: { featured: 1, active: 1 }, include: [{ model: models.User, attributes: User }, { model: models.Categories, attributes: Category }],
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
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id', 'busy', 'is_delivery'];
            Meals = ['meal_id', ['name_en', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_en', 'name'], 'active'];
            User = ['user_id', 'email', 'first_name', 'phone', 'last_name', 'user_type', 'profile', 'fcm'];
        } else {
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
            kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id', 'busy', 'is_delivery'];
            Meals = ['meal_id', ['name_ar', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Menu = ['menu_id', ['name_ar', 'name'], 'active'];
            User = ['user_id', 'email', 'first_name', 'phone', 'last_name', 'user_type', 'profile', 'fcm'];
        }


        models.kitchens.belongsTo(models.Categories, { foreignKey: 'category_id' });
        models.kitchens.hasMany(models.Menu, { foreignKey: 'kitchen_id' });
        models.Menu.hasMany(models.Meals, { foreignKey: 'menu_id' });
        models.kitchens.belongsTo(models.User, { foreignKey: 'user_id' });
        models.kitchens.hasMany(models.Profit, { foreignKey: 'kitchen_id' });

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
                }, { model: models.User, attributes: User }, { model: models.Categories, attributes: Category }, { model: models.Profit }],
                attributes: kitchens, where: { kitchen_id: kitchen_id }
            }).then((kitchens => {
                if (kitchens == null) {
                    resolve({});
                } else {

                    delete kitchens.dataValues['user'].dataValues['password'];
                    models.Reviews.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'user_id' });
                    models.Reviews.findAll({
                        limit: 4, order: [['date', 'DESC']],
                        where: { kitchen_id: kitchen_id },
                        include: [{
                            model: models.User, attributes: User
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
    getAdmin: function (kitchen_id) {

        User = ['user_id', 'email', 'first_name', 'phone', 'last_name', 'user_type', 'profile'];


        models.kitchens.belongsTo(models.Categories, { foreignKey: 'category_id' });
        models.kitchens.hasMany(models.Menu, { foreignKey: 'kitchen_id' });
        models.Menu.hasMany(models.Meals, { foreignKey: 'menu_id' });
        models.kitchens.belongsTo(models.User, { foreignKey: 'user_id' });
        models.kitchens.hasMany(models.Profit, { foreignKey: 'kitchen_id' });

        return new Promise(function (resolve, reject) {
            models.kitchens.findOne({
                include: [{
                    model: models.Menu,
                    required: false,
                    include: [{
                        required: false,
                        model: models.Meals,
                    }]
                }, { model: models.User, attributes: User }, { model: models.Categories }, { model: models.Profit }],
                where: { kitchen_id: kitchen_id }
            }).then((kitchens => {
                if (kitchens == null) {
                    resolve({});
                } else {

                    delete kitchens.dataValues['user'].dataValues['password'];
                    models.Reviews.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'user_id' });
                    models.Reviews.findAll({
                        limit: 4, order: [['date', 'DESC']],
                        where: { kitchen_id: kitchen_id },
                        include: [{
                            model: models.User, attributes: User
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
                user_id: user['dataValues'].user_id,
                served_count: 0,
                final_rate: 0,
                active: 0,
                lng: newKitchen.lng,
                lat: newKitchen.lat,
                location: newKitchen.location,
                is_delivery: newKitchen.is_delivery,

            }).then(contact => {
                resolve(contact);
            }, error => {
                reject(error)
            });
        });
    },
    createWithSP: function (newKitchen) {
        return new Promise(function (resolve, reject) {
            var password = bcrypt.hashSync(newKitchen.password, 8);

            UserRepository.CreateUserAdmin(newKitchen.email, password, newKitchen.first_name, newKitchen.last_name, newKitchen.phone, 'servicePro', newKitchen.active, newKitchen.profile).then((user) => {

                if (user == null) {
                    resolve({ user: null });
                }
                delete user.dataValues['password'];
                delete user.dataValues['otp'];
                models.kitchens.create({

                    name_ar: newKitchen.name_ar,
                    name_en: newKitchen.name_en,
                    category_id: newKitchen.category_id,
                    image: newKitchen.image,
                    description_ar: newKitchen.description_ar,
                    description_en: newKitchen.description_en,
                    start_time: newKitchen.start_time,
                    end_time: newKitchen.end_time,
                    user_id: user['dataValues'].user_id,
                    served_count: 0,
                    final_rate: 0,
                    active: 0,
                    lng: newKitchen.lng,
                    lat: newKitchen.lat,
                    location: newKitchen.location,
                    is_delivery: newKitchen.is_delivery,

                }).then(kitchen => {
                    resolve({ user: user, kitchen: kitchen });
                }, error => {
                    reject(error)
                });


            }).catch((err) => {
                reject(err)
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
                active: newKitchen.active,
                featured: newKitchen.featured,
                busy: newKitchen.busy,
            }, { where: { kitchen_id: newKitchen.kitchen_id } }).then(update => {
                KitchenRepository.getAdmin(newKitchen.kitchen_id).then((kitchen) => {
                    resolve(kitchen);
                });
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

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}
Object.assign(KitchenRepository, commonRepository);
module.exports = KitchenRepository;

