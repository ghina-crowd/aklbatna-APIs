var CitiesRepository = require('../repository/cities');


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
    getAllHasCities: function () {
        return new Promise(function (resolve, reject) {
            CitiesRepository.getAllHasCities().then(user => {
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