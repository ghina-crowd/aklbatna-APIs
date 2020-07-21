var models = require('../models/models.js');
var commonRepository = require('./common.js');
var lang = require('../app');
var constrains;
var about;

var constrainsRepository = {

    getConstrains: function () {
        return new Promise(function (resolve, reject) {
            models.Constraints.findOne().then((constrains => {
                if (constrains == null) {
                    resolve(null);
                } else {
                    resolve(constrains);
                }
            }), error => {
                reject(error);
            })
        });
    },


    getAllaboutAdmin: function (type) {
        return new Promise(function (resolve, reject) {
            models.About.findAll({ where: { type: type }, }).then((about => {
                if (about == null) {
                    resolve(null);
                } else {
                    resolve(about);
                }
            }), error => {
                reject(error);
            })
        });
    },
    getAllabout: function (type) {
        if (lang.acceptedLanguage == 'en') {
            about = ['about_id', ['title_en', 'title'], ['description_en', 'description']];
        } else {
            about = ['about_id', ['title_ar', 'title'], ['description_ar', 'description']];
        }
        return new Promise(function (resolve, reject) {
            models.About.findAll({ where: { type: type }, attributes: about }).then((about => {
                if (about == null) {
                    resolve(null);
                } else {
                    resolve(about);
                }
            }), error => {
                reject(error);
            })
        });
    },
    update: function (newaboutData) {
        return new Promise(function (resolve, reject) {
            models.About.update({
                title_en: newaboutData.title_en,
                title_ar: newaboutData.title_ar,
                description_ar: newaboutData.description_ar,
                description_en: newaboutData.description_en,
                type: newaboutData.type,
            }, { where: { about_id: newaboutData.about_id } }).then(about => {
                models.About.findOne({ where: { about_id: newaboutData.about_id } }).then((about => {
                    if (about == null) {
                        resolve({});
                    } else {
                        resolve(about);
                    }
                }), error => {
                    reject(error);
                })
            }, error => {
                reject(error)
            });
        });
    },


    createabout: function (newaboutData) {
        return new Promise(function (resolve, reject) {
            models.About.create({
                title_en: newaboutData.title_en,
                title_ar: newaboutData.title_ar,
                description_ar: newaboutData.description_ar,
                description_en: newaboutData.description_en,
                type: newaboutData.type,
            }).then(about => {
                resolve(about);
            }, error => {
                reject(error)
            });
        });
    },


    deleteabout: function (about_id) {
        return new Promise(function (resolve, reject) {
            models.About.destroy({ where: { about_id: about_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },


    updateConstrains: function (newconstrainsData) {
        return new Promise(function (resolve, reject) {
            models.Constraints.update({
                max_percentage: newconstrainsData.max_percentage,
                side_image: newconstrainsData.side_image,
            }, { where: {} }).then(constrains => {
                models.Constraints.findOne().then((constrains => {
                    if (constrains == null) {
                        resolve({});
                    } else {
                        resolve(constrains);
                    }
                }), error => {
                    reject(error);
                })
            }, error => {
                reject(error)
            });
        });
    },






};
Object.assign(constrainsRepository, commonRepository);
module.exports = constrainsRepository;