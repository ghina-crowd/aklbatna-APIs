var models = require('../models/models.js');
var dealRepository = require('../repository/deals.js');
var fields = require('../constant/field.js');
var service = {
    get_deals_by_categoryID: function (id , page) {
        return new Promise(function (resolve, reject) {
            dealRepository.get_deals_by_categoryID(id , page).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });
        });
    },


    get_deals_by_sub_category: function (id) {
        return new Promise(function (resolve, reject) {
            dealRepository.get_deals_by_sub_category(id).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });
        });
    },

    get_deal_by_id: function (id) {
        return new Promise(function (resolve, reject) {
            dealRepository.get_deal_by_id(id).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });
        });
    },

    get_related_deals: function (category_id  , deal_id) {
        return new Promise(function (resolve, reject) {
            dealRepository.get_related_deals(category_id , deal_id).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });
        });
    },

    filter_deals: function (category_id, sub_category_id, min_price, max_price, date, monthly_new, sort_by, rating , page , keyword) {
        return new Promise(function (resolve, reject) {
            dealRepository.filter_deals(category_id, sub_category_id, min_price, max_price, date, monthly_new, sort_by, rating , page , keyword).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });
        });
    },

    create_rate: function (user_id, deal_id, rate, comment) {
        return new Promise(function (resolve, reject) {
            dealRepository.create_rate(user_id, deal_id, rate, comment).then(rate => {
                resolve(rate);
            }, error => {
                reject(error);
            });
        });
    },


    get_Reviews: function (page , deal_id) {
        return new Promise(function (resolve, reject) {
            dealRepository.get_Reviews(page , deal_id).then(reviews => {
                resolve(reviews);
            }, error => {
                reject(error);
            });
        });
    },

    get_sub_deals: function (deal_id) {
        return new Promise(function (resolve, reject) {
            dealRepository.get_sub_deals(deal_id).then(reviews => {
                resolve(reviews);
            }, error => {
                reject(error);
            });
        });
    },
};




module.exports = service;