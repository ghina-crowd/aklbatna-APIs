var ContactRepository = require('../repository/Contact');


module.exports = {

    getAll: function (page) {
        return new Promise(function (resolve, reject) {
            ContactRepository.get(page).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    update: function (newBannerData) {
        return new Promise(function (resolve, reject) {
            ContactRepository.update(newBannerData).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    create: function (newBannerData) {
        return new Promise(function (resolve, reject) {
            ContactRepository.create(newBannerData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    delete: function (banner_id) {
        return new Promise(function (resolve, reject) {
            ContactRepository.delete(banner_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    }
};