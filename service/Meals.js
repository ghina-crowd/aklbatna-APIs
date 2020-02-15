var MealsRepository = require('../repository/Meals');


module.exports = {
    get: function (Kitchen_id, user_id) {
        return new Promise(function (resolve, reject) {
            MealsRepository.get(Kitchen_id, user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    get_related_meals: function (meal_id, category_id, user_id) {
        return new Promise(function (resolve, reject) {
            MealsRepository.get_related_meals(meal_id, category_id, user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    get_featured_meals: function (page, sortBy, user_id) {
        return new Promise(function (resolve, reject) {
            MealsRepository.get_featured(page, sortBy, user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    filters: function (filters, user_id) {
        return new Promise(function (resolve, reject) {
            MealsRepository.filters(filters, user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },

    getAll: function (user_id) {
        return new Promise(function (resolve, reject) {
            MealsRepository.getAll(user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    update: function (newMenuData) {
        return new Promise(function (resolve, reject) {
            MealsRepository.update(newMenuData).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    create: function (newMenuData) {
        return new Promise(function (resolve, reject) {
            MealsRepository.create(newMenuData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    delete: function (meal_id) {
        return new Promise(function (resolve, reject) {
            MealsRepository.delete(meal_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    },
    create_review: function (newReviewData) {
        return new Promise(function (resolve, reject) {
            MealsRepository.create_review(newReviewData).then(rate => {
                resolve(rate);
            }, error => {
                reject(error);
            });
        });
    },


    get_Reviews: function (page, meal_id) {
        return new Promise(function (resolve, reject) {
            MealsRepository.get_Reviews(page, meal_id).then(reviews => {
                resolve(reviews);
            }, error => {
                reject(error);
            });
        });
    },
};