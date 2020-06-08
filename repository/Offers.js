var models = require('../models/models.js');
var commonRepository = require('./common.js');
const sequelize = require('sequelize');
const Op = sequelize.Op;
var lang = require('../app');
var kitchens, Meals, Offer, Category, User;
var OffersRepository = {



    getSpCount: function (user_id) {

        return new Promise(function (resolve, reject) {
            models.Offers.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Offers.findAll({
                include: [{
                    required: true,
                    model: models.kitchens, where: {
                        user_id: user_id
                    }
                }]
            }).then((Offers => {
                if (Offers == null) {
                    resolve([]);
                } else {
                    resolve(Offers);
                }
            }), error => {
                reject(error);
            })
        });
    },

    get: function (offer_id) {

        if (lang.acceptedLanguage == 'en') {
            Offer = ['offer_id', ['title_en', 'title'], ['description_en', 'description'], 'active', 'meal_id', 'status', 'price', 'image'];
            kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id', 'busy', 'is_delivery'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];

        } else {
            Offer = ['offer_id', ['title_ar', 'title'], ['description_ar', 'description'], 'active', 'meal_id', 'status', 'price', 'image'];
            kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id', 'busy', 'is_delivery'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];

        }

        models.Offers.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' })
        models.kitchens.belongsTo(models.Categories, { foreignKey: 'category_id' })
        return new Promise(function (resolve, reject) {
            models.Offers.findOne({
                where: { offer_id: offer_id }, include: [{ model: models.kitchens, attributes: kitchens, include: [{ model: models.Categories, attributes: Category }] }]
            }).then((Offers => {
                if (Offers == null) {
                    resolve({});
                } else {
                    resolve(Offers);
                }
            }), error => {
                reject(error);
            });
        });
    },



    getAll: function (filters) {

        if (lang.acceptedLanguage == 'en') {
            Offer = ['offer_id', ['title_en', 'title'], ['description_en', 'description'], 'meal_id', 'status', 'price', 'image'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id', 'busy', 'is_delivery'];
        } else {
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            Offer = ['offer_id', ['title_ar', 'title'], ['description_ar', 'description'], 'meal_id', 'status', 'price', 'image'];
            kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'category_id', 'busy', 'is_delivery'];
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
        if (filters.meal_id && filters.meal_id !== '0' && filters.meal_id !== 0) {
            data.meal_id = filters.meal_id
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
                order.push(['price', 'ASC'])
            } else if (filters.sort_by == 2) {
                order.push(['price', 'DESC'])
            }
        }




        models.Offers.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' })
        models.kitchens.belongsTo(models.Categories, { foreignKey: 'category_id' })

        return new Promise(function (resolve, reject) {
            models.Offers.findAll({
                attributes: Offer, limit: pageSize, offset: offset, order: order, where: data,
                include: [{ model: models.kitchens, attributes: kitchens, where: dataCate, include: [{ model: models.Categories, attributes: Category }] }]
            }).then((Offers => {
                if (Offers == null) {
                    resolve([]);
                } else {



                    resolve(Offers);
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
        if (filters.meal_id && filters.meal_id !== '0' && filters.meal_id !== 0) {
            data.meal_id = filters.meal_id
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
        order.push(['offer_id', 'DESC']);
        if (filters.sort_by) {
            if (filters.sort_by == 1) {
                order.push(['price', 'ASC'])
            } else if (filters.sort_by == 2) {
                order.push(['price', 'DESC'])
            }
        }




        models.Offers.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' })
        return new Promise(function (resolve, reject) {
            models.Offers.findAndCountAll({
                limit: pageSize, offset: offset, order: order, where: data,
                include: [{ model: models.kitchens, where: dataCate, }]
            }).then((Offers => {
                if (Offers == null) {
                    resolve([]);
                } else {



                    var dealsTemp = Offers.rows;
                    Offers.Offers = dealsTemp;
                    delete Offers.rows;


                    resolve(Offers);
                }
            }), error => {
                reject(error);
            });
        });
    },


    create: function (newOffersData) {
        return new Promise(function (resolve, reject) {
            models.Offers.create({
                title_ar: newOffersData.title_ar,
                description_ar: newOffersData.description_ar,
                description_en: newOffersData.description_en,
                title_en: newOffersData.title_en,
                meal_id: newOffersData.meal_id,
                status: newOffersData.status,
                kitchen_id: newOffersData.kitchen_id,
                price: newOffersData.price,
                image: newOffersData.image
            }).then(Offers => {
                resolve(Offers);
            }, error => {
                reject(error)
            });
        });
    },

    update: function (newOffersData) {
        return new Promise(function (resolve, reject) {
            models.Offers.update({
                title_ar: newOffersData.title_ar,
                description_ar: newOffersData.description_ar,
                description_en: newOffersData.description_en,
                title_en: newOffersData.title_en,
                meal_id: newOffersData.meal_id,
                status: newOffersData.status,
                kitchen_id: newOffersData.kitchen_id,
                price: newOffersData.price,
                image: newOffersData.image
            }, { where: { offer_id: newOffersData.offer_id } }).then(Offers => {
                models.Offers.findOne({ where: { offer_id: newOffersData.offer_id } }).then(Updated => {
                    resolve(Updated);
                }, error => {
                    reject(error);
                });
            }, error => {
                reject(error)
            });
        });
    },
    delete: function (offers_id) {
        return new Promise(function (resolve, reject) {
            models.Offers.destroy({ where: { offer_id: offers_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    }
};
Object.assign(OffersRepository, commonRepository);
module.exports = OffersRepository;