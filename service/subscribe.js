var CitiesRepository = require('../repository/subscribe');


module.exports = {
    getAll: function () {
        return new Promise(function (resolve, reject) {
            CitiesRepository.getAllCities().then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getAllAdmin: function () {
        return new Promise(function (resolve, reject) {
            CitiesRepository.getAllsubscribesAdmin().then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    create: function (newsubscribeData) {
        return new Promise(function (resolve, reject) {
            CitiesRepository.createsubscribe(newsubscribeData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    update: function (credentials) {
        return new Promise(function (resolve, reject) {
            CitiesRepository.update(credentials).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    Delete: function (subscribe_id) {
        return new Promise(function (resolve, reject) {
            CitiesRepository.deletesubscribe(subscribe_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    }
};