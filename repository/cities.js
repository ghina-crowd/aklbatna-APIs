var models = require('../models/models.js');
var commonRepository = require('./common.js');
var company_model = require('../models/company_model');

var lang = require('../app');
var cities;

var CityRepository = {
    getAllCities: function () {
        return new Promise(function (resolve, reject) {
            models.Cities.findAll().then((cities => {
                if (cities == null) {
                    resolve(null);
                } else {
                    resolve(cities);
                }
            }), error => {
                reject(error);
            })
        });
    },
    getAllHasCities: function () {

        if (lang.acceptedLanguage == 'en') {
            cities = ['city_id', ['name_en', 'name'], 'payment_fee'];
        } else {
            cities = ['city_id', ['name_ar', 'name'], 'payment_fee'];
        }
        return new Promise(function (resolve, reject) {
            models.Cities.hasMany(company_model.Company_Branches, { foreignKey: 'city_id' })
            models.Cities.findAll({
                attributes: cities,
                where: { active: 1 },
                include: [{
                    required: true,
                    model: company_model.Company_Branches,
                }]


            }).then((cities => {
                if (cities == null) {
                    resolve(null);
                } else {
                    resolve(cities);
                }
            }), error => {
                reject(error);
            })
        });
    },

    getAll: function () {

        if (lang.acceptedLanguage == 'en') {
            cities = ['city_id', ['name_en', 'name'], 'payment_fee'];
        } else {
            cities = ['city_id', ['name_ar', 'name'], 'payment_fee'];
        }
        return new Promise(function (resolve, reject) {
            models.Cities.findAll({
                attributes: cities,
                where: { active: 1 }

            }).then((cities => {
                if (cities == null) {
                    resolve(null);
                } else {
                    resolve(cities);
                }
            }), error => {
                reject(error);
            })
        });
    },

    createCity: function (newContactUsData) {
        return new Promise(function (resolve, reject) {
            models.Cities.create({
                name_ar: newContactUsData.name_ar,
                name_en: newContactUsData.name_en,
                active: newContactUsData.active ? newContactUsData.active : 0,
                payment_fee: newContactUsData.payment_fee ? newContactUsData.payment_fee : 0,
            }).then(contact => {
                resolve(contact);
            }, error => {
                reject(error)
            });
        });
    },

    updateCity: function (newContactUsData) {
        return new Promise(function (resolve, reject) {
            models.Cities.update({
                name_ar: newContactUsData.name_ar,
                name_en: newContactUsData.name_en,
                active: newContactUsData.active ? newContactUsData.active : 0,
                payment_fee: newContactUsData.payment_fee ? newContactUsData.payment_fee : 0,
            }, { where: { city_id: newContactUsData.city_id } }).then(contact => {
                models.Cities.findOne({ where: { city_id: newContactUsData.city_id } }).then((city) => {
                    resolve(city);
                }, error => {
                    reject(error)
                })
            }, error => {
                reject(error)
            });
        });
    },


    deleteCity: function (city_id) {
        return new Promise(function (resolve, reject) {
            models.Cities.destroy({ where: { city_id: city_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    }

};
Object.assign(CityRepository, commonRepository);
module.exports = CityRepository;