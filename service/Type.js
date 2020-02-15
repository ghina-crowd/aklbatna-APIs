var models = require('../models/models.js');
var typeRepository = require('../repository/Type');
var service = {
    get_types: function () {
        return new Promise(function (resolve, reject) {
            typeRepository.get_types().then(types => {
                resolve(types);
            }, error => {
                reject(error);
            });
        });
    },

    get_type: function (type_id, page, keyword) {
        return new Promise(function (resolve, reject) {
            typeRepository.get_type(type_id, page, keyword).then(types => {
                resolve(types);
            }, error => {
                reject(error);
            });
        });
    },
    create_type: function (credentials) {
        return new Promise(function (resolve, reject) {
            typeRepository.create_type(credentials).then(types => {
                resolve(types);
            }, error => {
                reject(error);
            });
        });
    },
    update_type: function (credentials) {
        return new Promise(function (resolve, reject) {
            typeRepository.update_type(credentials).then(types => {
                resolve(types);
            }, error => {
                reject(error);
            });
        });
    },
    delete_type: function (shop_type_id) {
        return new Promise(function (resolve, reject) {
            typeRepository.deletetype(shop_type_id).then(response => {
                resolve(response);
            }, error => {
                reject(error);
            });
        });
    },
};
module.exports = service;