var models = require('../models/models');
var commonRepository = require('./common.js');
const Sequelize = require('sequelize');
var CategoryRepository = {
    get: function () {
        return new Promise(function (resolve, reject) {
            models.Banners.findAll({ where: { active: 1 } }).then(Banners => {
                if (Banners == null) {
                    resolve([]);
                } else {
                    resolve(Banners);
                }
            }, error => {
                reject(error);
            });
        });
    },
    create: function (newCategoryData) {
        return new Promise(function (resolve, reject) {
            models.Banners.create({
                button: newCategoryData.button,
                redirect: newCategoryData.redirect,
                url: newCategoryData.url,
                description_ar: newCategoryData.description_ar,
                description_en: newCategoryData.description_en,
                image: newCategoryData.image,
                active: 1, // default 
            }).then(category => {
                console.log(category['dataValues']);
                resolve(category);
            }, error => {
                reject(error)
            });
        });
    },
    update: function (newCategoryData) {
        return new Promise(function (resolve, reject) {
            models.Banners.update({
                button: newCategoryData.button,
                redirect: newCategoryData.redirect,
                url: newCategoryData.url,
                description_ar: newCategoryData.description_ar,
                description_en: newCategoryData.description_en,
                image: newCategoryData.image,
                active: newCategoryData.active,
            }, { where: { banner_id: newCategoryData.banner_id } }).then(function (result) {
                models.Banners.findOne({ where: { banner_id: newCategoryData.banner_id } }).then(category => {
                    resolve(category);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });

    },
    delete: function (banner_id) {
        return new Promise(function (resolve, reject) {
            console.log(banner_id)
            models.Banners.destroy({ where: { banner_id: banner_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },
};


Object.assign(CategoryRepository, commonRepository);
module.exports = CategoryRepository;