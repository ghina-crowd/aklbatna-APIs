var SubscriptionsRepository = require('../repository/Subscription');


module.exports = {
    get: function (Subscription_id) {
        return new Promise(function (resolve, reject) {
            SubscriptionsRepository.get(Subscription_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getAll: function (filters) {
        return new Promise(function (resolve, reject) {
            SubscriptionsRepository.getAll(filters).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getAllAdmin: function (filters) {
        return new Promise(function (resolve, reject) {
            SubscriptionsRepository.getAllAdmin(filters).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    update: function (newAddressData) {
        return new Promise(function (resolve, reject) {
            SubscriptionsRepository.update(newAddressData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    create: function (newAddressData) {
        return new Promise(function (resolve, reject) {
            SubscriptionsRepository.create(newAddressData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    delete: function (subscription_id) {
        return new Promise(function (resolve, reject) {
            SubscriptionsRepository.delete(subscription_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    }
};