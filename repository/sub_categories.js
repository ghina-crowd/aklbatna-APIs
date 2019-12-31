var models = require('../models/sub_categories_model.js');
var deals_model = require('../models/deals_model.js');
var company_model = require('../models/company_model');
var category_model = require('../models/categories_model.js');
var fields = require('../constant/field.js');
var commonRepository = require('./common.js');
const Sequelize = require('sequelize');
var lang = require('../app');
var model_rate = require('../models/rating_model.js');
const sequelize = require('sequelize');
const Op = Sequelize.Op;
var SubCategoryRepository = {
    Get_sub_categories: function () {
        return new Promise(function (resolve, reject) {
            models.SubCategory.findAll({ where: { active: 1 } }).then(categories => {
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

    get_sub_category: function (category_id) {
        return new Promise(function (resolve, reject) {
            models.SubCategory.findAll({ where: { active: 1, shop_category_id: category_id } }).then(categories => {
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
    Get_categories_products: function () {
        var cat_attributes, sub_cat_attributes;
        return new Promise(function (resolve, reject) {
            if (lang.acceptedLanguage == 'en') {
                cat_attributes = ['shop_category_id', ['name_en', 'name'], 'icon'];
                sub_cat_attributes = ['deal_id', 'sub_category_id', 'shop_category_id', 'company_id', 'branch_id', ['deal_title_en', 'deal_title'], ['details_en', 'details'], 'pre_price', 'new_price', 'main_image', 'start_time', 'end_time', 'active', 'final_rate'];
            } else {
                cat_attributes = ['shop_category_id', ['name_ar', 'name'], 'icon'];
                sub_cat_attributes = ['deal_id', 'sub_category_id', 'company_id', 'branch_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], ['details_ar', 'details'], 'pre_price', 'new_price', 'main_image', 'start_time', 'end_time', 'active', 'final_rate'];
            }

            category_model.Categories.hasMany(deals_model.Deals, { foreignKey: 'shop_category_id' })
            deals_model.Deals.belongsTo(company_model.Company, { foreignKey: 'company_id' })
            deals_model.Deals.belongsTo(company_model.Company_Branches, { foreignKey: 'branch_id' })
            category_model.Categories.findAll({
                attributes: cat_attributes,
                include: [{
                    order: [['start_time', 'DESC']],
                    attributes: sub_cat_attributes,
                    limit: 6,
                    where: { active: 1 },
                    model: deals_model.Deals,
                    include: [{
                        model: company_model.Company,
                    },
                    {
                        model: company_model.Company_Branches,
                        where: { status: 1 },
                    }]
                }]
            }).then(deals => {

                if (deals != null) {
                    deals.forEach(deals => {
                        deals.deals.forEach(item => {
                            //calculating percentage for new and old price
                            var percDiff = 100 * Math.abs((item.dataValues.new_price - item.dataValues.pre_price) / ((item.dataValues.pre_price + item.dataValues.new_price) / 2));
                            item.dataValues['percDiff'] = percDiff.toString().split('.')[0] + "%";
                        });
                    });
                    resolve(deals);



                } else {
                    resolve(null);
                }





            }, error => {
                reject(error);
            });
        });
    },
    Create_sub_category: function (newSubCategoryData) {
        return new Promise(function (resolve, reject) {
            models.SubCategory.create({
                sub_name_en: newSubCategoryData.sub_name_en,
                sub_name_ar: newSubCategoryData.sub_name_ar,
                short_details: newSubCategoryData.short_details,
                shop_category_id: newSubCategoryData.shop_category_id,
                active: 1 // default
            }).then(category => {
                console.log(category['dataValues']);
                resolve(category);
            }, error => {
                reject(error)
            });
        });
    },
    Update_sub_category: function (newSubCategoryData) {
        console.log(newSubCategoryData.active);
        return new Promise(function (resolve, reject) {
            models.SubCategory.update({
                sub_name_en: newSubCategoryData.sub_name_en,
                sub_name_ar: newSubCategoryData.sub_name_ar,
                short_details: newSubCategoryData.short_details,
                active: newSubCategoryData.active,
                shop_category_id: newSubCategoryData.shop_category_id,
            }, { where: { sub_category_id: newSubCategoryData.sub_category_id } }).then(function (result) {
                models.SubCategory.findOne({ where: { sub_category_id: newSubCategoryData.sub_category_id } }).then(category => {
                    resolve(category);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });

    },
    delete_sub_Category: function (sub_category_id) {
        return new Promise(function (resolve, reject) {
            models.SubCategory.destroy({ where: { sub_category_id: sub_category_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },

};
Object.assign(SubCategoryRepository, commonRepository);
module.exports = SubCategoryRepository;