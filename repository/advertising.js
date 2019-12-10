
var models = require('../models/models.js');
var commonRepository = require('./common.js');
var AdvertisingRepository = {
    GetAll: function () {
        return new Promise(function (resolve, reject) {
            models.Advertising.findAll().then(advertising => {
                resolve(advertising);
            }, error => {
                reject(error);
            });
        });

    }
};
Object.assign(AdvertisingRepository, commonRepository);
module.exports = AdvertisingRepository;