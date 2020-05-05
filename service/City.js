var CitiesRepository = require('../repository/City');


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
            CitiesRepository.getAllCitiesAdmin().then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    create: function (newCityData) {
        return new Promise(function (resolve, reject) {
            CitiesRepository.createCity(newCityData).then(function (result) {
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
    Delete: function (city_id) {
        return new Promise(function (resolve, reject) {
            CitiesRepository.deleteCity(city_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    }
};