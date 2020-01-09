var AdvertisingRepository = require('../repository/advertising');
module.exports = {
    GetAll: function () {
        return new Promise(function (resolve, reject) {
            AdvertisingRepository.GetAll().then(advertising => {
                resolve(advertising);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllAdvertising: function (id) {
        return new Promise(function (resolve, reject) {
            AdvertisingRepository.Get(id).then(advertising => {
                resolve(advertising);
            }, error => {
                reject(error);
            });
        });
    },
    create_advertising: function (credentials) {
        return new Promise(function (resolve, reject) {
            AdvertisingRepository.create_advertising(credentials).then(advertising => {
                resolve(advertising);
            }, error => {
                reject(error);
            });
        });
    },
    update_advertising: function (credentials) {
        return new Promise(function (resolve, reject) {
            AdvertisingRepository.update_advertising(credentials).then(advertising => {
                resolve(advertising);
            }, error => {
                reject(error);
            });
        });
    },
    delete_advertising: function (add_id) {
        return new Promise(function (resolve, reject) {
            AdvertisingRepository.delete_advertising(add_id).then(advertising => {
                resolve(advertising);
            }, error => {
                reject(error);
            });
        });
    },
};