var models = require('../models/models.js');
var subcategoryRepository = require('../repository/sub_categories.js');
var fields = require('../constant/field.js');
var service = {
    get_pro_categories: function () {
        return new Promise(function (resolve, reject) {
            subcategoryRepository.Get_categories_products().then(categories => {
                resolve(categories);
            }, error => {
                reject(error);
            });
        });
    },
    get_sub_categories: function () {
        return new Promise(function (resolve, reject) {
            subcategoryRepository.Get_sub_categories().then(categories => {
                resolve(categories);
            }, error => {
                reject(error);
            });
        });
    },
    get_sub_category: function (category_id) {
        return new Promise(function (resolve, reject) {
            subcategoryRepository.get_sub_category(category_id).then(categories => {
                resolve(categories);
            }, error => {
                reject(error);
            });
        });
    },
    create_sub_category: function (credentials) {
        return new Promise(function (resolve, reject) {
            subcategoryRepository.Create_sub_category(credentials).then(categories => {
                resolve(categories);
            }, error => {
                reject(error);
            });
        });
    },
    update_sub_category: function (credentials) {
        return new Promise(function (resolve, reject) {
            subcategoryRepository.Update_sub_category(credentials).then(categories => {
                resolve(categories);
            }, error => {
                reject(error);
            });
        });
    },
    delete_sub_category: function (sub_category_id) {
        return new Promise(function (resolve, reject) {
            subcategoryRepository.delete_sub_Category(sub_category_id).then(response => {
                resolve(response);
            }, error => {
                reject(error);
            });
        });
    },



};
module.exports = service;