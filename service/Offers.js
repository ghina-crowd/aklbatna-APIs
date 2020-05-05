var OffersRepository = require('../repository/Offers');


module.exports = {
    get: function (offer_id) {
        return new Promise(function (resolve, reject) {
            OffersRepository.get(offer_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getAll: function (filters) {
        return new Promise(function (resolve, reject) {
            OffersRepository.getAll(filters).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getAllAdmin: function (filters) {
        return new Promise(function (resolve, reject) {
            OffersRepository.getAllAdmin(filters).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    update: function (newAddressData) {
        return new Promise(function (resolve, reject) {
            OffersRepository.update(newAddressData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    create: function (newAddressData) {
        return new Promise(function (resolve, reject) {
            OffersRepository.create(newAddressData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    delete: function (Address_id) {
        return new Promise(function (resolve, reject) {
            OffersRepository.delete(Address_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    }
};