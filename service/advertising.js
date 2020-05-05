var AdvertisingRepository = require('../repository/advertising');
module.exports = {
    GetAllAdvertising: function () {
        return new Promise(function (resolve, reject) {
            AdvertisingRepository.GetAll().then(advertising => {
                resolve(advertising);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllAdmin: function () {
        return new Promise(function (resolve, reject) {
            AdvertisingRepository.GetAllAdmin().then(advertising => {
                resolve(advertising);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllAdmin: function (category) {
        return new Promise(function (resolve, reject) {
            AdvertisingRepository.GetAllAdmin(category).then(advertising => {
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
    get_advertising: function (user_id) {
        return new Promise(function (resolve, reject) {
            AdvertisingRepository.get_advertising(user_id).then(advertising => {
                resolve(advertising);
            }, error => {
                reject(error);
            });
        });
    },
};