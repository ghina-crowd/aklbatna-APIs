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
var company_model = require('../models/company_model');

const Op = sequelize.Op;
var deal_attributes, company_attributes, sub_deals_attributes, cat_attributes;

var dealsRepository = {
    get_deals_by_categoryID: function (id, page) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;
        return new Promise(function (resolve, reject) {
            if (lang.acceptedLanguage == 'en') {
                deal_attributes = ['deal_id', ['deal_title_en', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            } else {
                deal_attributes = ['deal_id', ['deal_title_ar', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
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
            deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            company_attributes = ['company_id', ['company_name_en', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link'];
            sub_deals_attributes = ['id', 'deal_id', ['title_en', 'title'], 'pre_price', 'new_price', 'count_bought'];
        } else {
            deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            company_attributes = ['company_id', ['company_name_ar', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_ar', 'description'], 'website_link'];
            sub_deals_attributes = ['id', 'deal_id', ['title_ar', 'title'], 'pre_price', 'new_price', 'count_bought'];
        }

        return new Promise(function (resolve, reject) {
            models.Deals.belongsTo(model_company.Company, { foreignKey: 'company_id', targetKey: 'company_id' });
            models.Deals.belongsTo(model_company.Company_Branches, { foreignKey: 'branch_id', targetKey: 'branch_id' });
            models.Deals.findOne({
                attributes: deal_attributes,
                where: { active: 1, deal_id: id },
                include: [{
                    model: model_company.Company,
                    attributes: company_attributes
                }, {
                    model: model_company.Company_Branches,
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

                                                    var pre_price_total = 0;
                                                    var new_price_subtotal = 0;

                                                    sub_deal.forEach(item => {
                                                        pre_price_total = pre_price_total + item.dataValues.pre_price;
                                                        new_price_subtotal = new_price_subtotal + item.dataValues.new_price;
                                                        var percDiff = 100 * Math.abs((item.dataValues.new_price - item.dataValues.pre_price) / ((item.dataValues.pre_price + item.dataValues.new_price) / 2));
                                                        item.dataValues['percDiff'] = percDiff;
                                                        all_sub_deals.push(item.dataValues);
                                                    });

                                                    var diff = pre_price_total - new_price_subtotal;
                                                    var percDiff = 100 * Math.abs((new_price_subtotal - pre_price_total) / ((pre_price_total + new_price_subtotal) / 2));
                                                    deals.dataValues['pre_price_total'] = pre_price_total;
                                                    deals.dataValues['new_price_subtotal'] = new_price_subtotal;
                                                    deals.dataValues['diff'] = diff;
                                                    deals.dataValues['percDiff'] = percDiff;

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
                deal_attributes = ['deal_id', ['deal_title_en', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            } else {
                deal_attributes = ['deal_id', ['deal_title_ar', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
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
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
                cat_attributes = ['shop_category_id', ['name_en', 'name'], 'icon'];

            } else {
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
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
                models.Deals.belongsTo(company_model.Company, { foreignKey: 'company_id' });
                models.Deals.belongsTo(company_model.Company_Branches, { foreignKey: 'branch_id' });
                category_model.Categories.findAll({
                    attributes: cat_attributes, limit: pageSize, offset: offset, order: order, where: data,
                    include: [{
                        model: models.Deals,
                        attributes: deal_attributes,
                        include: [{
                            model: company_model.Company,
                            attributes: company_attributes,
                        },
                        {
                            model: company_model.Company_Branches,
                        }]
                    }]
                }).then(category => {
                    var filter_deals = [];
                    category[0].deals.forEach(item => {

                        var percDiff = 100 * Math.abs((item.dataValues.new_price - item.dataValues.pre_price) / ((item.dataValues.pre_price + item.dataValues.new_price) / 2));
                        item.dataValues['percDiff'] = percDiff;

                        if (latitude && longitude) {
                            var distance = calcDistance(item["dataValues"].company_branch.latitude, item["dataValues"].company_branch.longitude, latitude, longitude);
                            console.log(distance);
                            if (distance <= 10) {
                                item["dataValues"].distance = distance;
                                filter_deals.push(item);
                                delete item["dataValues"].company;
                            }
                        } else {
                            delete item["dataValues"].company;
                            filter_deals.push(item);
                        }
                    });
                    category[0].deals = filter_deals;
                    resolve(category[0]);
                }, error => {
                    reject(error);
                });
            } else {
                models.Deals.belongsTo(company_model.Company, { foreignKey: 'company_id' })
                models.Deals.belongsTo(company_model.Company_Branches, { foreignKey: 'branch_id' })
                models.Deals.findAll({
                    limit: pageSize, offset: offset, order: order, where: data, attributes: deal_attributes,
                    include: [{
                        model: company_model.Company,
                        attributes: company_attributes,
                    },
                    {
                        model: company_model.Company_Branches,
                    }]
                }).then(deals => {
                    if (deals == null) {
                        resolve([]);
                    } else {
                        var filter_deals = [];

                        var pre_price_total = 0;
                        var new_price_subtotal = 0;
                        deals.forEach(item => {

                            //calculating pre price and new price so later we can get %
                            pre_price_total = pre_price_total + item["dataValues"].pre_price;
                            new_price_subtotal = new_price_subtotal + item["dataValues"].new_price;


                            var percDiff = 100 * Math.abs((item.dataValues.new_price - item.dataValues.pre_price) / ((item.dataValues.pre_price + item.dataValues.new_price) / 2));
                            item.dataValues['percDiff'] = percDiff;

                            //checking if lat lng are not null then we are going to calculate the distance with company location
                            if (latitude && longitude) {
                                var distance = calcDistance(item["dataValues"].company_branch.latitude, item["dataValues"].company_branch.longitude, latitude, longitude);
                                if (distance <= 10) {
                                    item["dataValues"].distance = distance;
                                    filter_deals.push(item);
                                    delete item["dataValues"].company;
                                }
                            } else {
                                delete item["dataValues"].company;
                                filter_deals.push(item);
                            }
                        });

                        var diff = pre_price_total - new_price_subtotal;
                        var percDiff = 100 * Math.abs((new_price_subtotal - pre_price_total) / ((pre_price_total + new_price_subtotal) / 2));
                        //sort the deals on with distance
                        filter_deals.sort((a, b) => parseFloat(a["dataValues"].distance) - parseFloat(b["dataValues"].distance));
                        var response = {};
                        response.pre_price_total = pre_price_total;
                        response.new_price_subtotal = new_price_subtotal;
                        response.diff = diff;
                        response.percDiff = percDiff;
                        response.deals = filter_deals;

                        resolve(response);
                    }
                }, error => {
                    reject(error);
                });
            }
        }
        )
            ;
    },
    get_deals: function (page, keyword) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;
        return new Promise(function (resolve, reject) {
            if (lang.acceptedLanguage == 'en') {
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
                cat_attributes = ['shop_category_id', ['name_en', 'name'], 'icon'];

            } else {
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
                cat_attributes = ['shop_category_id', ['name_en', 'name'], 'icon'];

            }
            var data = {}
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
            models.Deals.hasMany(model_images.Images, { foreignKey: 'deal_id' })
            models.Deals.findAll({
                limit: pageSize, offset: offset, attributes: deal_attributes,
                include: [{
                    model: model_images.Images
                }]
            }).then(deals => {
                if (deals == null) {
                    resolve([]);
                } else {
                    resolve(deals);
                }
            }, error => {
                reject(error);
            });
        }
        );
    },
    get_related_deals: function (category_id, deal_id) {
        if (lang.acceptedLanguage == 'en') {
            deal_attributes = ['deal_id', ['deal_title_en', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
        } else {
            deal_attributes = ['deal_id', ['deal_title_ar', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
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
    },
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
    },
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
    create_deal: async function (newDealData) {
        return new Promise(function (resolve, reject) {
            models.Deals.create({
                user_id: newDealData.user_id,
                sub_category_id: newDealData.sub_category_id,
                shop_category_id: newDealData.shop_category_id,
                company_id: newDealData.company_id,
                branch_id: newDealData.branch_id,
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

                for (let k in newDealData.images) {
                    var temp_data = {};
                    temp_data['deal_id'] = deal.deal_id;
                    temp_data['source'] = newDealData.images[k];
                    dealsRepository.create_deal_image(temp_data)
                }


                if (newDealData.sub_deal) {
                    for (let k in newDealData.sub_deal) {
                        newDealData.sub_deal[k]['deal_id'] = deal.deal_id;
                        // console.log(newDealData.sub_deal[k]);
                        // console.log(newDealData.sub_deal[k].title_er);
                        dealsRepository.create_sub_deal(newDealData.sub_deal[k]);
                    }
                }
                dealsRepository.get_deal_by_id(deal.deal_id).then(deal => {
                    resolve(deal);
                });

            }, error => {
                reject(error)
            });
        });
    },
    create_sub_deal: function (newSubDealData) {
        return new Promise(function (resolve, reject) {
            sub_deals.SubDeals.create({
                deal_id: newSubDealData.deal_id,
                title_en: newSubDealData.title_en,
                title_ar: newSubDealData.title_ar,
                pre_price: newSubDealData.pre_price,
                new_price: newSubDealData.new_price,
            }).then(deal => {
                resolve(deal);
            }, error => {
                reject(error)
            });
        });
    },
    update_deal: function (newDealData) {
        console.log(newDealData.active);
        return new Promise(function (resolve, reject) {
            models.Deals.update({
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
            }, { where: { deal_id: newDealData.deal_id } }).then(function (result) {
                models.Deals.findOne({ where: { deal_id: newDealData.deal_id } }).then(deal => {
                    resolve(deal);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },
    update_sub_deal: function (newSubDealData) {
        return new Promise(function (resolve, reject) {
            sub_deals.SubDeals.update({
                deal_id: newSubDealData.deal_id,
                title_en: newSubDealData.title_en,
                title_ar: newSubDealData.title_ar,
                pre_price: newSubDealData.pre_price,
                new_price: newSubDealData.new_price,
            }, { where: { id: newSubDealData.id } }).then(function (result) {
                sub_deals.SubDeals.findOne({ where: { id: newSubDealData.id } }).then(deal => {
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
    create_deal_image: function (newDealData) {
        return new Promise(function (resolve, reject) {
            model_images.Images.create({
                source: newDealData.source,
                deal_id: newDealData.deal_id
            }).then(image => {
                resolve(image);
            }, error => {
                reject(error)
            });
        });
    },
    update_deal_image: function (newImageData) {
        return new Promise(function (resolve, reject) {
            model_images.Images.update({
                source: newImageData.source,
                deal_id: newImageData.deal_id
            }, { where: { img_id: newImageData.img_id } }).then(function (result) {
                model_images.Images.findOne({ where: { img_id: newImageData.img_id } }).then(image => {
                    resolve(image);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },
    delete_deal_image: function (img_id) {
        return new Promise(function (resolve, reject) {
            model_images.Images.destroy({ where: { img_id: img_id } }).then(deleted => {
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


    get_servicePro_deals: function (user_id) {

        return new Promise(function (resolve, reject) {
            if (lang.acceptedLanguage == 'en') {
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];

            } else {
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            }

            model_company.Company.findOne({
                where: {
                    user_id: user_id
                }, attributes: ['company_id'],

            }).then(company => {
                if (company == null || !company['dataValues'].company_id) {
                    resolve([]);
                } else {
                    models.Deals.hasMany(model_images.Images, { foreignKey: 'deal_id' })
                    models.Deals.findAll({
                        where: {
                            company_id: company['dataValues'].company_id
                        },
                        attributes: deal_attributes,
                        include: [{
                            model: model_images.Images
                        }]
                    }).then(deals => {
                        if (deals == null) {
                            resolve([]);
                        } else {
                            resolve(deals);
                        }
                    }, error => {
                        reject(error);
                    });
                }
            }, error => {
                reject(error);
            });
        }
        );
    },
    get_salesRep_deals: function (user_id) {

        return new Promise(function (resolve, reject) {
            if (lang.acceptedLanguage == 'en') {
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            } else {
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            }

            models.Deals.hasMany(model_images.Images, { foreignKey: 'deal_id' })
            models.Deals.findAll({
                where: {
                    user_id: user_id
                },
                attributes: deal_attributes,
                include: [{
                    model: model_images.Images
                }]
            }).then(deals => {
                if (deals == null) {
                    resolve([]);
                } else {
                    resolve(deals);
                }
            }, error => {
                reject(error);
            });
        }
        );
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