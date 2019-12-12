var models = require('../models/models.js');
var categoryRepository = require('../repository/categories.js');
var fields = require('../constant/field.js');
var service = {
    get_categories: function () {
        return new Promise(function (resolve, reject) {
            categoryRepository.Get_categories().then(categories => {
                resolve(categories);
            }, error => {
                reject(error);
            });
        });
    },

    get_categories_sub_categories: function () {
        return new Promise(function (resolve, reject) {
            categoryRepository.get_categories_sub_categories().then(categories => {
                resolve(categories);
            }, error => {
                reject(error);
            });
        });
    },
    create_category: function (credentials) {
        return new Promise(function (resolve, reject) {
            categoryRepository.Create_category(credentials).then(categories => {
                resolve(categories);
            }, error => {
                reject(error);
            });Î
        });
    },
    update_category: function (credentials) {
        return new Promise(function (resolve, reject) {
            categoryRepository.Update_category(credentials).then(categories => {
                resolve(categories);
            }, error => {
                reject(error);
            });
        });
    },
    delete_category: function (shop_category_id) {
        return new Promise(function (resolve, reject) {
            categoryRepository.deleteCategory(shop_category_id).then(response => {
                resolve(response);
            }, error => {
                reject(error);
            });
        });
    },
};
module.exports = service;