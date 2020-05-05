var models = require('../models/models.js');
var commonRepository = require('./common.js');
var lang = require('../app');
var cities;

var CityRepository = {

    getAllCitiesAdmin: function () {
        return new Promise(function (resolve, reject) {
            models.City.findAll().then((cities => {
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
    getAllCities: function () {
        if (lang.acceptedLanguage == 'en') {
            cities = ['city_id', ['name_en', 'name'], 'active'];
        } else {
            cities = ['city_id', ['name_ar', 'name'], 'active'];
        }
        return new Promise(function (resolve, reject) {
            models.City.findAll({ attributes: cities }).then((cities => {
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
    update: function (newCityData) {
        return new Promise(function (resolve, reject) {
            models.City.update({
                city_id: newCityData.city_id,
                name_ar: newCityData.name_ar,
                name_en: newCityData.name_en,
                active: newCityData.active,
            }, { where: { city_id: newCityData.city_id } }).then(city => {
                models.City.findOne({ where: { city_id: newCityData.city_id } }).then((City => {
                    if (City == null) {
                        resolve({});
                    } else {
                        resolve(City);
                    }
                }), error => {
                    reject(error);
                })
            }, error => {
                reject(error)
            });
        });
    },


    createCity: function (newCityData) {
        return new Promise(function (resolve, reject) {
            models.City.create({
                name_ar: newCityData.name_ar,
                name_en: newCityData.name_en,
                active: newCityData.active,
            }).then(contact => {
                resolve(contact);
            }, error => {
                reject(error)
            });
        });
    },


    deleteCity: function (city_id) {
        return new Promise(function (resolve, reject) {
            models.City.destroy({ where: { city_id: city_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    }

};
Object.assign(CityRepository, commonRepository);
module.exports = CityRepository;