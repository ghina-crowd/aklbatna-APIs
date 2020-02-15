var BannersRepository = require('../repository/Banners');


module.exports = {

    getAll: function () {
        return new Promise(function (resolve, reject) {
            BannersRepository.get().then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    update: function (newBannerData) {
        return new Promise(function (resolve, reject) {
            BannersRepository.update(newBannerData).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    create: function (newBannerData) {
        return new Promise(function (resolve, reject) {
            BannersRepository.create(newBannerData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    delete: function (banner_id) {
        return new Promise(function (resolve, reject) {
            BannersRepository.delete(banner_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    }
};