var models = require('../models/models');
var commonRepository = require('./common.js');
const sequelize = require('sequelize');
const Op = sequelize.Op;
var lang = require('../app');
var type;
var typeRepository = {
    get_types: function () {


        if (lang.acceptedLanguage == 'en') {
            type = ['type_id', ['name_en', 'name']];
        } else {
            type = ['type_id', ['name_ar', 'name']];
        }
        return new Promise(function (resolve, reject) {
            models.Type.findAll({
                attributes: type
            }).then(types => {
                if (types == null) {
                    resolve([]);
                } else {
                    resolve(types);
                }
            }, error => {
                reject(error);
            });
        });
    },

    create_type: function (newtypeData) {
        return new Promise(function (resolve, reject) {
            models.Type.create({
                name_en: newtypeData.name_en,
                name_ar: newtypeData.name_ar,
            }).then(type => {
                console.log(type['dataValues']);
                resolve(type);
            }, error => {
                reject(error)
            });
        });
    },
    update_type: function (newtypeData) {
        return new Promise(function (resolve, reject) {
            models.Type.update({
                name_en: newtypeData.name_en,
                name_ar: newtypeData.name_ar,
            }, { where: { type_id: newtypeData.type_id } }).then(function (result) {
                models.Type.findOne({ where: { type_id: newtypeData.type_id } }).then(type => {
                    resolve(type);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });

    },
    deletetype: function (type_id) {
        return new Promise(function (resolve, reject) {
            console.log(type_id)
            models.Type.destroy({ where: { type_id: type_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },
};


Object.assign(typeRepository, commonRepository);
module.exports = typeRepository;