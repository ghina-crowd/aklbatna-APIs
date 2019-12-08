var models = require('../models/categories_model.js');
var deals_model = require('../models/deals_model.js');
var sub_category_model=require('../models/sub_categories_model.js');;
var fields = require('../constant/field.js');
var commonRepository = require('./common.js');
const Sequelize = require('sequelize');
var lang = require('../app');

const Op = Sequelize.Op;
var CategoryRepository = {
    Get_categories: function () {
        return new Promise(function (resolve, reject) {
            models.Categories.findAll({where: {active: 1}}).then(categories => {
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

 get_categories_sub_categories: function () {
        var sub_cat_attributes ,cat_attributes;
    return new Promise(function (resolve, reject) {
        if (lang.acceptedLanguage == 'en') {
            cat_attributes = ['shop_category_id', ['name_en', 'name']];
            sub_cat_attributes = ['sub_category_id', ['sub_name_en', 'sub_name']];
        } else {
            cat_attributes = ['shop_category_id', ['name_ar', 'name']];
            sub_cat_attributes = ['sub_category_id', ['sub_name_ar', 'sub_name']];
        }
        models.Categories.hasMany(sub_category_model.SubCategory, { foreignKey: 'shop_category_id' });
        models.Categories.findAll({ attributes: cat_attributes ,
            include: [{
                model: sub_category_model.SubCategory ,
                attributes: sub_cat_attributes,
                where: {active:1}

            }]
        }).then(deals => {
            resolve(deals);
        }, error => {
            reject(error);
        });
        // models.Categories.findAll({attributes: cat_attributes
        // }).then(categories => {
        //     sub_category_model.SubCategory.findAll({
        //         attributes: sub_cat_attributes
        //     }, {where: {active: 1}}).then(sub_categories => {
        //         categories.forEach(item => {
        //             var subArray = [];
        //             sub_categories.forEach(sub => {
        //                 if (sub.dataValues.shop_category_id == item.dataValues.shop_category_id) {
        //                     subArray.push(sub.dataValues);
        //                 }
        //             })
        //             item.dataValues['sub_category'] = subArray;
        //         });
        //         resolve(categories);
        //     });
        //
        // }, error => {
        //     reject(error);
        // });

    });
},
};


Object.assign(CategoryRepository, commonRepository);
module.exports = CategoryRepository;