var models = require('../models/categories_model.js');
var deals_model = require('../models/deals_model.js');
var fields = require('../constant/field.js');
var commonRepository = require('./common.js');
const Sequelize = require('sequelize');
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
};
Object.assign(CategoryRepository, commonRepository);
module.exports = CategoryRepository;