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
    get_related_meals: function (category_id, user_id) {
        return new Promise(function (resolve, reject) {
            MealsRepository.get_related_meals(category_id, user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    get_featured_meals: function (page, sortBy, user_id, pageCount) {
        return new Promise(function (resolve, reject) {
            MealsRepository.get_featured(page, sortBy, user_id, pageCount).then(user => {
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
    filtersAdmin: function (filters, user_id) {
        return new Promise(function (resolve, reject) {
            MealsRepository.filtersAdmin(filters, user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getAll: function (page, sortBy, user_id) {
        return new Promise(function (resolve, reject) {
            MealsRepository.getAll(page, sortBy, user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getByKitchenId: function (user_id, Kitchen_id, page) {
        return new Promise(function (resolve, reject) {
            MealsRepository.getByKitchenId(user_id, Kitchen_id, page).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getByKitchenIdAdmin: function (Kitchen_id) {
        return new Promise(function (resolve, reject) {
            MealsRepository.getByKitchenIdWithoutPagination(Kitchen_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getAllAdmin: function (user_id) {
        return new Promise(function (resolve, reject) {
            MealsRepository.getAllAdmin(user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getAdmin: function (meal_id, user_id) {
        return new Promise(function (resolve, reject) {
            MealsRepository.getAdmin(meal_id, user_id).then(user => {
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