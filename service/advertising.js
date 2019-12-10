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
    }
};