var KitchensRepository = require('../repository/Kitchen');


module.exports = {

    get: function (Kitchen_id) {
        return new Promise(function (resolve, reject) {
            KitchensRepository.get(Kitchen_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    get_featured: function (page) {
        return new Promise(function (resolve, reject) {
            KitchensRepository.get_featured(page).then(user => {
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
    update: function (newKitchenData) {
        return new Promise(function (resolve, reject) {
            KitchensRepository.update(newKitchenData).then(user => {
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
    delete: function (kitchen_id) {
        return new Promise(function (resolve, reject) {
            KitchensRepository.delete(kitchen_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    },

    create_review: function (newReviewData) {
        return new Promise(function (resolve, reject) {
            KitchensRepository.create_review(newReviewData).then(rate => {
                resolve(rate);
            }, error => {
                reject(error);
            });
        });
    },


    get_Reviews: function (page, kitchen_id) {
        return new Promise(function (resolve, reject) {
            KitchensRepository.get_Reviews(page, kitchen_id).then(reviews => {
                resolve(reviews);
            }, error => {
                reject(error);
            });
        });
    },

};