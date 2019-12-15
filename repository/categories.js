var models = require('../models/categories_model.js');
var deals_model = require('../models/deals_model.js');
var sub_category_model = require('../models/sub_categories_model.js');;
var fields = require('../constant/field.js');
var commonRepository = require('./common.js');
const Sequelize = require('sequelize');
var lang = require('../app');

const Op = Sequelize.Op;
var CategoryRepository = {
    Get_categories: function () {
        return new Promise(function (resolve, reject) {
            models.Categories.findAll({ where: { active: 1 } }).then(categories => {
                if (categories == null) {
                    resolve(null);
                } else {
                    resolve(categories);
                }
            }, error => {
                reject(error);
            });
        });
    },
    Create_category: function (newCategoryData) {
        return new Promise(function (resolve, reject) {
            models.Categories.create({
                name_en: newCategoryData.name_en,
                name_ar: newCategoryData.name_ar,
                url_rewrite: newCategoryData.url_rewrite,
                short_desc: newCategoryData.short_desc,
                active: newCategoryData.active,
                keyword: newCategoryData.keyword,
                icon: newCategoryData.icon
            }).then(category => {
                console.log(category['dataValues']);
                resolve(category);
            }, error => {
                reject(error)
            });
        });
    },
    Update_category: function (newCategoryData) {
        return new Promise(function (resolve, reject) {
            models.Categories.update({
                name_en: newCategoryData.name_en,
                name_ar: newCategoryData.name_ar,
                url_rewrite: newCategoryData.url_rewrite,
                short_desc: newCategoryData.short_desc,
                active: newCategoryData.active,
                keyword: newCategoryData.keyword,
                icon: newCategoryData.icon
            }, { where: { shop_category_id: newCategoryData.shop_category_id } }).then(function (result) {
                models.Categories.findOne({ where: { shop_category_id: newCategoryData.shop_category_id } }).then(category => {
                    resolve(category);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });

    },
    deleteCategory: function (shop_category_id) {
        return new Promise(function (resolve, reject) {
            models.Categories.destroy({ where: { shop_category_id: shop_category_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },
    get_categories_sub_categories: function () {
        var sub_cat_attributes, cat_attributes;
        return new Promise(function (resolve, reject) {
            if (lang.acceptedLanguage == 'en') {
                cat_attributes = ['shop_category_id', ['name_en', 'name']];
                sub_cat_attributes = ['sub_category_id', ['sub_name_en', 'sub_name']];
            } else {
                cat_attributes = ['shop_category_id', ['name_ar', 'name']];
                sub_cat_attributes = ['sub_category_id', ['sub_name_ar', 'sub_name']];
            }
            models.Categories.hasMany(sub_category_model.SubCategory, { foreignKey: 'shop_category_id' });
            models.Categories.findAll({
                attributes: cat_attributes,
                include: [{
                    model: sub_category_model.SubCategory,
                    attributes: sub_cat_attributes,
                    where: { active: 1 }

                }]
            }).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });

        });
    },
};


Object.assign(CategoryRepository, commonRepository);
module.exports = CategoryRepository;