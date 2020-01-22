var models = require('../models/models.js');
var commonRepository = require('./common.js');
var company_model = require('../models/company_model');

var lang = require('../app');
var cities;

var CityRepository = {
    getAllCities: function () {

        if (lang.acceptedLanguage == 'en') {
            cities = ['city_id', ['name_en', 'name']];
        } else {
            cities = ['city_id', ['name_ar', 'name']];
        }
        return new Promise(function (resolve, reject) {
            models.Cities.findAll({ attributes: cities }).then((cities => {
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
            cities = ['city_id', ['name_en', 'name']];
        } else {
            cities = ['city_id', ['name_ar', 'name']];
        }
        return new Promise(function (resolve, reject) {
            models.Cities.hasMany(company_model.Company_Branches, { foreignKey: 'city_id' })
            models.Cities.findAll({
                attributes: cities,
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

    createCity: function (newContactUsData) {
        return new Promise(function (resolve, reject) {
            models.Cities.create({
                name_ar: newContactUsData.name_ar,
                name_en: newContactUsData.name_en,
            }).then(contact => {
                resolve(contact);
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