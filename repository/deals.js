var models = require('../models/deals_model.js');
var model_rate = require('../models/rating_model.js');
var model_images = require('../models/image_model.js');
var sub_deals = require('../models/sub_deals_model.js');
var model_company = require('../models/company_model.js');
var model_user = require('../models/models.js');
var category_model = require('../models/categories_model.js');
var commonRepository = require('./common.js');
const sequelize = require('sequelize');
var lang = require('../app');
var companymodel = require('../models/company_model');

const Op = sequelize.Op;
var deal_attributes, company_attributes, sub_deals_attributes, cat_attributes;

var dealsRepository = {
    get_deals_by_categoryID: function (id, page) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;
        return new Promise(function (resolve, reject) {
            if (lang.acceptedLanguage == 'en') {
                deal_attributes = ['deal_id', ['deal_title_en', 'deal_title'], 'latitude', 'longitude', 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            } else {
                deal_attributes = ['deal_id', ['deal_title_ar', 'deal_title'], 'latitude', 'longitude', 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            }
            models.Deals.findAll({
                limit: pageSize,
                offset: offset,
                attributes: deal_attributes,
                where: { active: 1, shop_category_id: id }
            }).then(deals => {
                if (deals == null) {
                    resolve(null);
                } else {
                    resolve(deals);
                }
            }, error => {
                reject(error);
            });
        });
    },

    get_deal_by_id: function (id) {
        if (lang.acceptedLanguage == 'en') {
            deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'latitude', 'longitude', 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            company_attributes = ['company_id', ['company_name_en', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link'];
            sub_deals_attributes = ['id', 'deal_id', ['title_en', 'title'], 'pre_price', 'new_price', 'count_bought'];
        } else {
            deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'latitude', 'longitude', 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            company_attributes = ['company_id', ['company_name_ar', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_ar', 'description'], 'website_link'];
            sub_deals_attributes = ['id', 'deal_id', ['title_ar', 'title'], 'pre_price', 'new_price', 'count_bought'];
        }

        return new Promise(function (resolve, reject) {
            models.Deals.belongsTo(model_company.Company, { foreignKey: 'company_id', targetKey: 'company_id' });
            models.Deals.findOne({
                attributes: deal_attributes,
                where: { active: 1, deal_id: id },
                include: [{
                    model: model_company.Company,
                    attributes: company_attributes
                }],

            }).then(deals => {
                if (deals == null) {
                    resolve(null);
                } else {
                    model_rate.Rating.belongsTo(model_user.User, { foreignKey: 'user_id', targetKey: 'user_admin_id' });
                    model_rate.Rating.findAll({
                        limit: 4, order: [['date', 'DESC']],
                        where: { deal_id: id },
                        include: [{
                            model: model_user.User,
                            attributes: ['user_admin_id', 'first_name', 'last_name']
                        }],

                    }).then(rating => {
                        if (deals == null) {
                            resolve(null);
                        } else {
                            model_rate.Rating.findAll({
                                attributes: [[sequelize.fn('COUNT', sequelize.col('rating_id')), 'reviews_count']],
                                where: { deal_id: id },
                            }).then(reviews_count => {
                                if (deals == null) {
                                    resolve(null);
                                } else {
                                    deals.dataValues['reviews_count'] = reviews_count[0].dataValues['reviews_count'];
                                }
                            });

                            var all_rate = [];
                            rating.forEach(item => {
                                all_rate.push(item.dataValues);

                            });
                            deals.dataValues['reviews'] = all_rate;
                            model_images.Images.findAll({ where: { deal_id: id } }).then(images => {
                                if (images == null) {
                                    resolve(null);
                                } else {
                                    var all_images = [];
                                    images.forEach(item => {
                                        all_images.push(item.dataValues);
                                    });
                                    deals.dataValues['images'] = all_images;
                                    sub_deals.SubDeals.findAll({
                                        where: { deal_id: id },
                                        attributes: sub_deals_attributes
                                    }).then(sub_deal => {
                                        if (sub_deal == null) {
                                            resolve(null);
                                        } else {
                                            sub_deals.SubDeals.findAll({
                                                attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'sub_deals_count']],
                                                where: { deal_id: id },
                                            }).then(sub_deals_count => {
                                                if (sub_deals_count == null) {
                                                    resolve(null);
                                                } else {
                                                    deals.dataValues['sub_deals_count'] = sub_deals_count[0].dataValues['sub_deals_count'];
                                                    var all_sub_deals = [];
                                                    sub_deal.forEach(item => {
                                                        all_sub_deals.push(item.dataValues);
                                                    });
                                                    deals.dataValues['sub_deals'] = all_sub_deals;

                                                    resolve(deals);

                                                }
                                            });

                                        }
                                    }, error => {
                                        reject(error);
                                    });
                                }
                            }, error => {
                                reject(error);
                            });

                        }
                    }
                        ,
                        error => {
                            reject(error);
                        }
                    );

                }
            }, error => {
                reject(error);
            });
        });
    },

    get_deals_by_sub_category: function (id) {
        return new Promise(function (resolve, reject) {
            if (lang.acceptedLanguage == 'en') {
                deal_attributes = ['deal_id', ['deal_title_en', 'deal_title'], 'latitude', 'longitude', 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            } else {
                deal_attributes = ['deal_id', ['deal_title_ar', 'deal_title'], 'latitude', 'longitude', 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            }
            models.Deals.findAll({
                attributes: deal_attributes,
                where: { active: 1, sub_category_id: id }
            }).then(deals => {
                if (deals == null) {
                    resolve(null);
                } else {
                    resolve(deals);
                }
            }, error => {
                reject(error);
            });
        });
    },

    filter_deals: function (category_id, sub_category_id, min_price, max_price, date, monthly_new, sort_by, rating, page, keyword, latitude, longitude) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;
        return new Promise(function (resolve, reject) {
            if (lang.acceptedLanguage == 'en') {
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'latitude', 'longitude', 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
                cat_attributes = ['shop_category_id', ['name_en', 'name'], 'icon'];

            } else {
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'latitude', 'longitude', 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
                cat_attributes = ['shop_category_id', ['name_en', 'name'], 'icon'];

            }
            var data = {}
            if (category_id) {
                data.shop_category_id = category_id;
            }
            if (sub_category_id) {
                data.sub_category_id = sub_category_id;
            }
            if (min_price && max_price) {
                data.new_price = {
                    [Op.and]: {
                        [Op.gte]: min_price,
                        [Op.lte]: max_price
                    }
                }
            }

            if (date) {
                data.end_time = {
                    [Op.lte]: date,
                }
            }

            if (monthly_new) {
                if (monthly_new == 1) {
                    data.is_monthly = 1;
                } else if (monthly_new == 2) {

                    var d = new Date(); // today!
                    var x = 3; // go back 5 days!
                    d.setDate(d.getDate() - x);
                    data.start_time = {
                        [Op.and]: {
                            [Op.gte]: d
                        }
                    }
                }
            }

            if (rating) {
                data.final_rate = {
                    [Op.gte]: rating
                }
            }
            var search = [];
            if (keyword) {
                if (lang.acceptedLanguage == 'en') {
                    data.deal_title_en = {
                        [Op.like]: '%' + keyword + '%'
                    }
                } else {
                    data.deal_title_ar = {
                        [Op.like]: '%' + keyword + '%'
                    }
                }
            }


            var order = [];

            if (sort_by) {
                if (sort_by == 1) {
                    order.push(['new_price', 'ASC'])
                } else if (sort_by == 2) {
                    order.push(['new_price', 'DESC'])
                }

            }

            if (category_id) {
                category_model.Categories.hasMany(models.Deals, { foreignKey: 'shop_category_id' })
                models.Deals.belongsTo(companymodel.Company, { foreignKey: 'company_id' });
                category_model.Categories.findAll({
                    attributes: cat_attributes, limit: pageSize, offset: offset, order: order, where: data,
                    include: [{
                        model: models.Deals,
                        attributes: deal_attributes,
                        include: [{
                            model: companymodel.Company,
                            attributes: company_attributes,
                        }]
                    }]
                }).then(categoty => {
                    var filterdeals = [];
                    categoty[0].deals.forEach(item => {
                        if (latitude && longitude) {
                            var distance = calcDistance(item["dataValues"].company.latitude, item["dataValues"].company.longitude, latitude, longitude);
                            console.log(distance);
                            if (distance <= 10) {
                                item["dataValues"].distance = distance;
                                filterdeals.push(item);
                                delete item["dataValues"].company;
                            }
                        } else {
                            delete item["dataValues"].company;
                            filterdeals.push(item);
                        }
                    });
                    categoty[0].deals = filterdeals;
                    resolve(categoty[0]);
                }, error => {
                    reject(error);
                });
            } else {
                models.Deals.belongsTo(companymodel.Company, { foreignKey: 'company_id' })
                models.Deals.findAll({
                    limit: pageSize, offset: offset, order: order, where: data, attributes: deal_attributes,
                    include: [{
                        model: companymodel.Company,
                        attributes: company_attributes,
                    }]
                }).then(deals => {
                    if (deals == null) {
                        resolve([]);
                    } else {
                        var filterdeals = [];
                        deals.forEach(item => {
                            if (latitude && longitude) {
                                var distance = calcDistance(item["dataValues"].company.latitude, item["dataValues"].company.longitude, latitude, longitude);
                                console.log(distance);
                                if (distance <= 10) {
                                    item["dataValues"].distance = distance;
                                    filterdeals.push(item);
                                    delete item["dataValues"].company;
                                }
                            } else {
                                delete item["dataValues"].company;
                                filterdeals.push(item);
                            }
                        });
                        filterdeals.sort((a, b) => parseFloat(a["dataValues"].distance) - parseFloat(b["dataValues"].distance));
                        resolve(filterdeals);
                    }
                }, error => {
                    reject(error);
                });
            }
        }
        )
            ;
    },

    get_related_deals: function (category_id, deal_id) {
        if (lang.acceptedLanguage == 'en') {
            deal_attributes = ['deal_id', ['deal_title_en', 'deal_title'], 'latitude', 'longitude', 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
        } else {
            deal_attributes = ['deal_id', ['deal_title_ar', 'deal_title'], 'latitude', 'longitude', 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
        }
        return new Promise(function (resolve, reject) {
            models.Deals.findAll({
                limit: 4,
                attributes: deal_attributes,
                where: { active: 1, shop_category_id: category_id, deal_id: { [Op.ne]: deal_id } }
            }).then(deals => {
                if (deals == null) {
                    resolve(null);
                } else {
                    resolve(deals);
                }
            }, error => {
                reject(error);
            });
        });
    }
    ,

    create_rate: function (user_id, deal_id, rate, comment) {
        console.log(user_id);
        return new Promise(function (resolve, reject) {
            model_rate.Rating.create({
                user_id: user_id,
                deal_id: deal_id,
                rate: rate,
                date: new Date(),
                comment: comment,
            }).then(rate => {
                console.log(rate);
                if (rate == null) {
                    resolve(null);
                } else {
                    resolve(rate);
                    model_rate.Rating.findAll({
                        attributes: ['deal_id', [sequelize.fn('SUM', sequelize.col('rate')), 'sum_rate'], [sequelize.fn('COUNT', sequelize.col('rate')), 'count_rate']]
                        , where: { deal_id: deal_id }
                    }).then(rating => {
                        if (rating == null) {
                            resolve(null);
                        } else {

                            var final_rate = rating[0].dataValues['sum_rate'] / rating[0].dataValues['count_rate'];
                            final_rate = final_rate.toFixed(1);
                            models.Deals.update(
                                { final_rate: final_rate }, { where: { deal_id: deal_id } }
                            ).then(function (result) {
                                resolve(result);
                            }, function (error) {
                            }, function (error) {
                                reject(error);
                            });
                        }
                    }, error => {
                        reject(error);
                    });
                }
            }, error => {
                reject(error);
            });
        });
    }
    ,

    get_Reviews: function (page, deal_id) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;
        return new Promise(function (resolve, reject) {
            model_rate.Rating.belongsTo(model_user.User, { foreignKey: 'user_id', targetKey: 'user_admin_id' });
            model_rate.Rating.findAll({
                limit: pageSize,
                offset: offset,
                order: [['date', 'DESC']],
                where: { deal_id: deal_id },
                include: [{
                    model: model_user.User,
                    attributes: ['user_admin_id', 'first_name', 'last_name']
                }],
            }).then(reviews => {
                if (reviews == null) {
                    resolve(null);
                } else {
                    resolve(reviews);
                }
            }, error => {
                reject(error);
            });
        });
    },

    get_sub_deals: function (deal_id) {
        return new Promise(function (resolve, reject) {
            if (lang.acceptedLanguage == 'en') {
                sub_deals_attributes = ['id', 'deal_id', ['title_en', 'title'], 'pre_price', 'new_price', 'count_bought'];
            } else {
                sub_deals_attributes = ['id', 'deal_id', ['title_ar', 'title'], 'pre_price', 'new_price', 'count_bought'];
            }
            sub_deals.SubDeals.findAll({
                attributes: sub_deals_attributes,
                where: { deal_id: deal_id },
            }).then(reviews => {
                if (reviews == null) {
                    resolve(null);
                } else {
                    resolve(reviews);
                }
            }, error => {
                reject(error);
            });
        });
    },
    create_deal: function (newDealData) {
        return new Promise(function (resolve, reject) {
            models.Deals.create({
                user_id: newDealData.user_id,
                sub_category_id: newDealData.sub_category_id,
                shop_category_id: newDealData.shop_category_id,
                company_id: newDealData.company_id,
                deal_title_en: newDealData.deal_title_en,
                deal_title_ar: newDealData.deal_title_ar,
                short_detail: newDealData.short_detail,
                details_en: newDealData.details_en,
                details_ar: newDealData.details_ar,
                pre_price: newDealData.pre_price,
                new_price: newDealData.new_price,
                start_time: newDealData.start_time,
                end_time: newDealData.end_time,
                active: newDealData.active,
                main_image: newDealData.main_image,
                premium: newDealData.premium,
                location_address: newDealData.location_address,
                is_monthly: newDealData.is_monthly,
                final_rate: newDealData.final_rate,

            }).then(deal => {
                resolve(deal);
            }, error => {
                reject(error)
            });
        });
    },
    create_sub_deal: function (newSubCategoryData) {
        return new Promise(function (resolve, reject) {
            sub_deals.SubDeals.create({
                sub_name_en: newSubCategoryData.sub_name_en,
                sub_name_ar: newSubCategoryData.sub_name_ar,
                short_details: newSubCategoryData.short_details,
                shop_category_id: newSubCategoryData.shop_category_id
            }).then(deal => {
                resolve(deal);
            }, error => {
                reject(error)
            });
        });
    },
    update_deal: function (newSubCategoryData) {
        console.log(newSubCategoryData.active);
        return new Promise(function (resolve, reject) {
            models.Deals.update({
                sub_name_en: newSubCategoryData.sub_name_en,
                sub_name_ar: newSubCategoryData.sub_name_ar,
                short_details: newSubCategoryData.short_details,
                active: newSubCategoryData.active,
                shop_category_id: newSubCategoryData.shop_category_id,
            }, { where: { sub_category_id: newSubCategoryData.sub_category_id } }).then(function (result) {
                models.Deals.findOne({ where: { sub_category_id: newSubCategoryData.sub_category_id } }).then(deal => {
                    resolve(deal);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },

    update_sub_deal: function (newSubCategoryData) {
        console.log(newSubCategoryData.active);
        return new Promise(function (resolve, reject) {
            sub_deals.SubDeals.update({
                sub_name_en: newSubCategoryData.sub_name_en,
                sub_name_ar: newSubCategoryData.sub_name_ar,
                short_details: newSubCategoryData.short_details,
                active: newSubCategoryData.active,
                shop_category_id: newSubCategoryData.shop_category_id,
            }, { where: { sub_category_id: newSubCategoryData.sub_category_id } }).then(function (result) {
                models.Deals.findOne({ where: { sub_category_id: newSubCategoryData.sub_category_id } }).then(deal => {
                    resolve(deal);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },
    delete_deal: function (deal_id) {
        return new Promise(function (resolve, reject) {
            models.Deals.destroy({ where: { deal_id: deal_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },
    delete_sub_deal: function (id) {
        return new Promise(function (resolve, reject) {
            sub_deals.SubDeals.destroy({ where: { id: id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },


};


//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}
Object.assign(dealsRepository, commonRepository);
module.exports = dealsRepository;