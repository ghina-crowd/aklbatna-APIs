var models = require('../models/models');
var commonRepository = require('./common.js');
const Sequelize = require('sequelize');
var Banners;
var lang = require('../app');


var BannersRepository = {

    getAllAdmin: function () {
        return new Promise(function (resolve, reject) {
            models.Banners.findAll().then(Banners => {
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
    get: function () {
        return new Promise(function (resolve, reject) {

            if (lang.acceptedLanguage == 'en') {
                Banners = ['banner_id', ['description_en', 'description'], 'button', 'redirect', 'url', 'image'];

            } else {
                Banners = ['banner_id', ['description_ar', 'description'], 'button', 'redirect', 'url', 'image'];
            }


            models.Banners.findAll({ where: { active: 1 }, attributes: Banners }).then(Banners => {
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

    getCount: function () {
        return new Promise(function (resolve, reject) {

            models.Banners.findAll().then(Banners => {
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


Object.assign(BannersRepository, commonRepository);
module.exports = BannersRepository;