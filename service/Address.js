var AddressRepository = require('../repository/Address');


module.exports = {
    get: function (user_id) {
        return new Promise(function (resolve, reject) {
            AddressRepository.get(user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    update: function (newAddressData) {
        return new Promise(function (resolve, reject) {
            AddressRepository.update(newAddressData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    create: function (newAddressData) {
        return new Promise(function (resolve, reject) {
            AddressRepository.create(newAddressData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    delete: function (Address_id) {
        return new Promise(function (resolve, reject) {
            AddressRepository.delete(Address_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    }
};