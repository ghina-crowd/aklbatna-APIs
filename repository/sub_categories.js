var models = require('../models/sub_categories_model.js');
var deals_model = require('../models/deals_model.js');
var category_model = require('../models/categories_model.js');
var fields = require('../constant/field.js');
var commonRepository = require('./common.js');
const Sequelize = require('sequelize');
var lang = require('../app');


const Op = Sequelize.Op;
var SubCategoryRepository = {
    Get_sub_categories: function () {
        return new Promise(function (resolve, reject) {
            models.SubCategory.findAll({where: {active: 1}}).then(categories => {
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
        var cat_attributes ,sub_cat_attributes ;
        return new Promise(function (resolve, reject) {
            if (lang.acceptedLanguage == 'en') {
                cat_attributes = ['shop_category_id', ['name_en', 'name'] , 'icon'];
                sub_cat_attributes = ['deal_id' , 'sub_category_id', 'shop_category_id' , ['deal_title_en' , 'deal_title'], 'latitude', 'longitude', 'short_detail', ['details_en' , 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'active', 'premium', 'location_address'];
            } else {
                cat_attributes = ['shop_category_id', ['name_ar', 'name'] , 'icon'];
                sub_cat_attributes = ['deal_id' , 'sub_category_id', 'shop_category_id' , ['deal_title_ar' , 'deal_title'], 'latitude', 'longitude', 'short_detail', ['details_ar' , 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'active', 'premium', 'location_address'];
            }

            category_model.Categories.hasMany(deals_model.Deals, { foreignKey: 'shop_category_id' })
            category_model.Categories.findAll({ attributes: cat_attributes ,
                include: [{
                    model: deals_model.Deals,
                    order: [['start_time' , 'DESC']],
                    attributes: sub_cat_attributes,
                    limit: 4 ,
                    where: {active: 1}
                }]
            }).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });



        });
    },
};
Object.assign(SubCategoryRepository, commonRepository);
module.exports = SubCategoryRepository;