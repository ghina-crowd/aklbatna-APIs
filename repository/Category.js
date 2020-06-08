var models = require('../models/models');
var commonRepository = require('./common.js');
const sequelize = require('sequelize');
const Op = sequelize.Op;
var lang = require('../app');
var kitchens, Meals, Menu, Category;
var CategoryRepository = {
    get_categories: function () {


        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count'];
            Meals = ['meal_id', ['name_en', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served'];
            Menu = ['menu_id', ['name_en', 'name'], 'active'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
        } else {
            kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count'];
            Meals = ['meal_id', ['name_ar', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served'];
            Menu = ['menu_id', ['name_ar', 'name'], 'active'];
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
        }
        models.Categories.hasMany(models.kitchens, { foreignKey: 'category_id' });
        return new Promise(function (resolve, reject) {
            models.Categories.findAll({
                where: { active: 1 }, attributes: Category
            }).then(categories => {
                if (categories == null) {
                    resolve([]);
                } else {
                    resolve(categories);
                }
            }, error => {
                reject(error);
            });
        });
    },
    get_categoriesAdmin: function () {

        models.Categories.hasMany(models.kitchens, { foreignKey: 'category_id' });
        return new Promise(function (resolve, reject) {
            models.Categories.findAll({
            }).then(categories => {
                if (categories == null) {
                    resolve([]);
                } else {
                    resolve(categories);
                }
            }, error => {
                reject(error);
            });
        });
    },
    get_category: function (categor_id, page, keyword) {

        var pageSize = 12; // page start from 0
        const offset = page * pageSize;

        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count'];
            Meals = ['meal_id', ['name_en', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served'];
            Menu = ['menu_id', ['name_en', 'name'], 'active'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
        } else {
            kitchens = ['kitchen_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count'];
            Meals = ['meal_id', ['name_ar', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served'];
            Menu = ['menu_id', ['name_ar', 'name'], 'active'];
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
        }

        models.Categories.hasMany(models.kitchens, { foreignKey: 'category_id' });
        models.Menu.hasMany(models.Meals, { foreignKey: 'menu_id' });
        models.kitchens.hasMany(models.Menu, { foreignKey: 'kitchen_id' });


        var data = {}

        if (keyword) {
            if (lang.acceptedLanguage == 'en') {
                data.name_en = {
                    [Op.like]: '%' + keyword + '%'
                }
            } else {
                data.name_ar = {
                    [Op.like]: '%' + keyword + '%'
                }
            }
        }


        if (page == -1) {
            return new Promise(function (resolve, reject) {
                models.Categories.findOne({
                    where: { category_id: categor_id, active: 1 }, attributes: Category,
                }).then(categories => {
                    if (categories == null) {
                        resolve({});
                    } else {
                        models.kitchens.findAndCountAll({
                            distinct: true, attributes: kitchens,
                            where: [{ category_id: categor_id, active: 1 }, data], include: [{
                                model: models.Menu,
                                attributes: Menu,
                                include: [{
                                    model: models.Meals,
                                    attributes: Meals,
                                }]
                            }]
                        }).then(kitchens => {
                            if (kitchens == null) {
                                resolve({});
                            } else {
                                var kitchensTemp = kitchens.rows;
                                kitchens.kitchens = kitchensTemp;
                                delete kitchens.rows;
                                categories['dataValues'].kitchens = kitchens;
                                resolve(categories);
                            }
                        }, error => {
                            reject(error);
                        });
                    }
                }, error => {
                    reject(error);
                });
            });
        } else {
            return new Promise(function (resolve, reject) {
                models.Categories.findOne({
                    where: { category_id: categor_id, active: 1 }, attributes: Category
                }).then(categories => {
                    if (categories == null) {
                        resolve({});
                    } else {
                        models.kitchens.findAndCountAll({
                            distinct: true, attributes: kitchens, limit: pageSize,
                            offset: offset,
                            where: [{ category_id: categor_id, active: 1 }, data], include: [{
                                model: models.Menu,
                                attributes: Menu,
                                include: [{
                                    model: models.Meals,
                                    attributes: Meals,
                                }]
                            }]
                        }).then(kitchens => {
                            if (kitchens == null) {
                                resolve({});
                            } else {
                                var kitchensTemp = kitchens.rows;
                                kitchens.kitchens = kitchensTemp;
                                delete kitchens.rows;
                                categories['dataValues'].kitchens = kitchens;
                                resolve(categories);
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



    },
    create_category: function (newCategoryData) {
        return new Promise(function (resolve, reject) {
            models.Categories.create({
                name_en: newCategoryData.name_en,
                name_ar: newCategoryData.name_ar,
                image: newCategoryData.image,
                active: 1, // default 
            }).then(category => {
                console.log(category['dataValues']);
                resolve(category);
            }, error => {
                reject(error)
            });
        });
    },
    update_category: function (newCategoryData) {
        return new Promise(function (resolve, reject) {
            models.Categories.update({
                name_en: newCategoryData.name_en,
                name_ar: newCategoryData.name_ar,
                image: newCategoryData.image,
                active: newCategoryData.active,
            }, { where: { category_id: newCategoryData.category_id } }).then(function (result) {
                models.Categories.findOne({ where: { category_id: newCategoryData.category_id } }).then(category => {
                    resolve(category);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });

    },
    deleteCategory: function (category_id) {
        return new Promise(function (resolve, reject) {
            console.log(category_id)
            models.Categories.destroy({ where: { category_id: category_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },
};


Object.assign(CategoryRepository, commonRepository);
module.exports = CategoryRepository;