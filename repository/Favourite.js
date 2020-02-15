var models = require('../models/models.js');
var commonRepository = require('./common.js');

var lang = require('../app');
var Menu, Meals, Category, kitchens;

var KitchenRepository = {


    get: function (user_id) {

        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', 'category_id', ['name_en', 'name'], 'user_id', 'image', ['description_en', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate'];
            Meals = ['meal_id', ['name_en', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];

        } else {
            kitchens = ['kitchen_id', 'category_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate'];
            Meals = ['meal_id', ['name_ar', 'name'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'featured'];
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];

        }

        models.Favourite.belongsTo(models.Meals, { foreignKey: 'meal_id' });
        models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
        models.Meals.belongsTo(models.Categories, { foreignKey: 'category_id' });


        return new Promise(function (resolve, reject) {
            models.Favourite.findAll({
                attributes: Menu, where: { user_id: user_id }, include: [{
                    model: models.Meals,
                    attributes: Meals
                    , include: [{ model: models.kitchens, attributes: kitchens }, { model: models.Categories, attributes: Category }]
                }]
            }).then((Favourites => {
                if (Favourites == null) {
                    resolve({});
                } else {
                    resolve(Favourites);
                }
            }), error => {
                reject(error);
            })
        });
    },

    create: function (newFavouritesData) {
        return new Promise(function (resolve, reject) {
            models.Favourite.create({
                meal_id: newFavouritesData.meal_id,
                user_id: newFavouritesData.user_id,
            }).then(meal => {
                resolve(meal);
            }, error => {
                reject(error)
            });
        });
    },


    delete: function (favourite_id) {
        return new Promise(function (resolve, reject) {
            models.Favourite.destroy({ where: { favourite_id: favourite_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },

    deletebyUserAndMealID: function (data) {
        return new Promise(function (resolve, reject) {
            models.Favourite.destroy({ where: { user_id: data.user_id, meal_id: data.meal_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    }

};
Object.assign(KitchenRepository, commonRepository);
module.exports = KitchenRepository;