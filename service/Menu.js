var KitchensRepository = require('../repository/Menu');


module.exports = {
    get: function (menu_id) {
        return new Promise(function (resolve, reject) {
            KitchensRepository.get(menu_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getAll: function () {
        return new Promise(function (resolve, reject) {
            KitchensRepository.getAll().then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    update: function (credentials) {
        return new Promise(function (resolve, reject) {
            KitchensRepository.update(credentials).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    create: function (newKitchenData) {
        return new Promise(function (resolve, reject) {
            KitchensRepository.create(newKitchenData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    delete: function (menu_id) {
        return new Promise(function (resolve, reject) {
            KitchensRepository.delete(menu_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    }
};