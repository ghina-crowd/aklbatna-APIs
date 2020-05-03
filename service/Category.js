var models = require('../models/models.js');
var categoryRepository = require('../repository/Category');
var fields = require('../constant/field.js');
var service = {
    get_categories: function () {
        return new Promise(function (resolve, reject) {
            categoryRepository.get_categories().then(categories => {
                resolve(categories);
            }, error => {
                reject(error);
            });
        });
    },


    get_categoriesAdmin: function () {
        return new Promise(function (resolve, reject) {
            categoryRepository.get_categoriesAdmin().then(categories => {
                resolve(categories);
            }, error => {
                reject(error);
            });
        });
    },

    get_category: function (category_id, page, keyword) {
        return new Promise(function (resolve, reject) {
            categoryRepository.get_category(category_id, page, keyword).then(categories => {
                resolve(categories);
            }, error => {
                reject(error);
            });
        });
    },
    create_category: function (credentials) {
        return new Promise(function (resolve, reject) {
            categoryRepository.create_category(credentials).then(categories => {
                resolve(categories);
            }, error => {
                reject(error);
            });
        });
    },
    update_category: function (credentials) {
        return new Promise(function (resolve, reject) {
            categoryRepository.update_category(credentials).then(categories => {
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