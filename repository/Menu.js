var models = require('../models/models.js');
var commonRepository = require('./common.js');

var lang = require('../app');
var Menu, Meals;

var KitchenRepository = {

    getAllAdmin: function () {

        models.Menu.hasMany(models.Meals, { foreignKey: 'menu_id' });
        return new Promise(function (resolve, reject) {
            models.Menu.findAll({
                include: [{
                    model: models.Meals,
                }]
            }).then((Menu => {
                if (Menu == null) {
                    resolve([]);
                } else {
                    resolve(Menu);
                }
            }), error => {
                reject(error);
            })
        });
    },
    getAdmin: function (menu_id) {

        models.Menu.hasMany(models.Meals, { foreignKey: 'menu_id' });
        return new Promise(function (resolve, reject) {
            models.Menu.findOne({
                where: { menu_id: menu_id }, include: [{
                    model: models.Meals,
                }]
            }).then((Menu => {
                if (Menu == null) {
                    resolve({});
                } else {
                    resolve(Menu);
                }
            }), error => {
                reject(error);
            })
        });
    },


    getAll: function () {

        if (lang.acceptedLanguage == 'en') {
            Meals = ['meal_id', ['name_en', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served'];
            Menu = ['menu_id', ['name_en', 'name'], 'active'];
        } else {

            Meals = ['meal_id', ['name_ar', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served'];
            Menu = ['menu_id', ['name_ar', 'name'], 'active'];
        }
        models.Menu.hasMany(models.Meals, { foreignKey: 'menu_id' });
        return new Promise(function (resolve, reject) {
            models.Menu.findAll({
                attributes: Menu, where: { active: 1 }, include: [{
                    model: models.Meals,
                    attributes: Meals,
                    where: { active: 1 }
                }]
            }).then((Menu => {
                if (Menu == null) {
                    resolve([]);
                } else {
                    resolve(Menu);
                }
            }), error => {
                reject(error);
            })
        });
    },
    get: function (menu_id) {
        if (lang.acceptedLanguage == 'en') {
            Meals = ['meal_id', ['name_en', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served'];
            Menu = ['menu_id', ['name_en', 'name'], 'active'];
        } else {

            Meals = ['meal_id', ['name_ar', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served'];
            Menu = ['menu_id', ['name_ar', 'name'], 'active'];
        }
        models.Menu.hasMany(models.Meals, { foreignKey: 'menu_id' });
        return new Promise(function (resolve, reject) {
            models.Menu.findOne({
                attributes: Menu, where: { menu_id: menu_id }, include: [{
                    model: models.Meals,
                    attributes: Meals,
                    where: { active: 1 }
                }]
            }).then((Menu => {
                if (Menu == null) {
                    resolve({});
                } else {
                    resolve(Menu);
                }
            }), error => {
                reject(error);
            })
        });
    },
    getMenuByKitchen: function (kitchen_id) {

        models.Menu.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
        return new Promise(function (resolve, reject) {
            models.Menu.findAll({
                where: { kitchen_id: kitchen_id }, include: [{ model: models.kitchens }]
            }).then((Menu => {
                if (Menu == null) {
                    resolve([]);
                } else {
                    resolve(Menu);
                }
            }), error => {
                reject(error);
            })
        });
    },

    create: function (newMenuData) {
        return new Promise(function (resolve, reject) {
            models.Menu.create({
                kitchen_id: newMenuData.kitchen_id,
                name_ar: newMenuData.name_ar,
                name_en: newMenuData.name_en,
                active: 1,
            }).then(meal => {
                resolve(meal);
            }, error => {
                reject(error)
            });
        });
    },
    update: function (newMenuData) {
        return new Promise(function (resolve, reject) {
            models.Menu.update({
                kitchen_id: newMenuData.kitchen_id,
                name_ar: newMenuData.name_ar,
                name_en: newMenuData.name_en,
                active: newMenuData.active,
            }, { where: { menu_id: newMenuData.menu_id } }).then(meal => {
                models.Menu.findOne({ where: { menu_id: newMenuData.menu_id } }).then((Menu => {
                    if (Menu == null) {
                        resolve({});
                    } else {
                        resolve(Menu);
                    }
                }), error => {
                    reject(error);
                })
            }, error => {
                reject(error)
            });
        });
    },


    delete: function (menu_id) {
        return new Promise(function (resolve, reject) {
            models.Menu.destroy({ where: { menu_id: menu_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    }

};
Object.assign(KitchenRepository, commonRepository);
module.exports = KitchenRepository;