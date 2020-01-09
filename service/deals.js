var dealRepository = require('../repository/deals.js');
var userRepository = require('../repository/users');
var service = {
    get_deals_by_categoryID: function (id, page) {
        return new Promise(function (resolve, reject) {
            dealRepository.get_deals_by_categoryID(id, page).then(deals => {
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
    }, get_deal_by_id_admin: function (id) {
        return new Promise(function (resolve, reject) {
            dealRepository.get_deal_by_id_admin(id).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });
        });
    },

    get_related_deals: function (category_id, deal_id) {
        return new Promise(function (resolve, reject) {
            dealRepository.get_related_deals(category_id, deal_id).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });
        });
    },

    filter_deals: function (category_id, sub_category_id, min_price, max_price, date, monthly_new, sort_by, rating, page, keyword, latitude, longitude) {
        return new Promise(function (resolve, reject) {
            dealRepository.filter_deals(category_id, sub_category_id, min_price, max_price, date, monthly_new, sort_by, rating, page, keyword, latitude, longitude).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });
        });
    },

    filter_dealsAdmin: function (category_id, sub_category_id, min_price, max_price, date, monthly_new, sort_by, rating, page, keyword, latitude, longitude) {
        return new Promise(function (resolve, reject) {
            dealRepository.filter_dealsAdmin(category_id, sub_category_id, min_price, max_price, date, monthly_new, sort_by, rating, page, keyword, latitude, longitude).then(deals => {
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


    get_Reviews: function (page, deal_id) {
        return new Promise(function (resolve, reject) {
            dealRepository.get_Reviews(page, deal_id).then(reviews => {
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
    create_deal: async function (credentials) {
        return new Promise(async function (resolve, reject) {
            dealRepository.create_deal(credentials).then(async deal => {

                userRepository.CreateActivity(credentials.user_id, '1', 'pending', deal.deal_id, null).then(activity => {
                    resolve(deal);
                })
            }, error => {
                reject(error);
            });
        });
    },
    get_deals: function (page, keyword) {
        return new Promise(function (resolve, reject) {
            dealRepository.get_deals(page, keyword).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });
        });
    },
    update_deal: async function (credentials) {
        return new Promise(async function (resolve, reject) {
            dealRepository.update_deal(credentials).then(async deal => {
                resolve(deal);
            }, error => {
                reject(error);
            });
        });
    },
    delete_deal: function (deal_id) {
        return new Promise(function (resolve, reject) {
            dealRepository.delete_deal(deal_id).then(response => {
                resolve(response);
            }, error => {
                reject(error);
            });
        });
    },
    delete_review: function (rating_id) {
        return new Promise(function (resolve, reject) {
            dealRepository.delete_review(rating_id).then(response => {
                resolve(response);
            }, error => {
                reject(error);
            });
        });
    },
    create_sub_deal: function (credentials) {
        return new Promise(function (resolve, reject) {
            dealRepository.create_sub_deal(credentials).then(deal => {
                resolve(deal);
            }, error => {
                reject(error);
            });
        });
    },

    create_deal_image: function (credentials) {
        return new Promise(function (resolve, reject) {
            dealRepository.create_deal_image(credentials).then(deal => {
                resolve(deal);
            }, error => {
                reject(error);
            });
        });
    },
    create_deal_info: function (credentials) {
        return new Promise(function (resolve, reject) {
            dealRepository.create_deal_info(credentials).then(deal => {
                resolve(deal);
            }, error => {
                reject(error);
            });
        });
    },
    create_deal_condition: function (credentials) {
        return new Promise(function (resolve, reject) {
            dealRepository.create_deal_condition(credentials).then(deal => {
                resolve(deal);
            }, error => {
                reject(error);
            });
        });
    },
    update_deal_image: function (credentials) {
        return new Promise(function (resolve, reject) {
            dealRepository.update_deal_image(credentials).then(deal => {
                resolve(deal);
            }, error => {
                reject(error);
            });
        });
    },
    delete_deal_image: function (img_id) {
        return new Promise(function (resolve, reject) {
            dealRepository.delete_deal_image(img_id).then(response => {
                resolve(response);
            }, error => {
                reject(error);
            });
        });
    },
    delete_deal_info: function (info_id) {
        return new Promise(function (resolve, reject) {
            dealRepository.delete_deal_info(info_id).then(response => {
                resolve(response);
            }, error => {
                reject(error);
            });
        });
    },
    delete_deal_condition: function (condition_id) {
        return new Promise(function (resolve, reject) {
            dealRepository.delete_deal_condition(condition_id).then(response => {
                resolve(response);
            }, error => {
                reject(error);
            });
        });
    },
    update_sub_deal: function (credentials) {
        return new Promise(function (resolve, reject) {
            dealRepository.update_sub_deal(credentials).then(subDeal => {
                resolve(subDeal);
            }, error => {
                reject(error);
            });
        });
    },
    delete_sub_deal: function (id) {
        return new Promise(function (resolve, reject) {
            dealRepository.delete_sub_deal(id).then(response => {
                resolve(response);
            }, error => {
                reject(error);
            });
        });
    },

    get_servicePro_deals: function (user_id, page) {
        return new Promise(function (resolve, reject) {
            dealRepository.get_servicePro_deals(user_id, page).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });
        });
    },
    get_salesRep_deals: function (user_id, page) {
        return new Promise(function (resolve, reject) {
            dealRepository.get_salesRep_deals(user_id, page).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });
        });
    },


};




module.exports = service;