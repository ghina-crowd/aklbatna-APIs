var models = require('../models/models.js');
var models_deals = require('../models/deals_model');
var models_company = require('../models/company_model');
var rating_model = require('../models/rating_model');
var models_sub_deals = require('../models/sub_deals_model');
var commonRepository = require('./common.js');
var lang = require('../app');
var deal_attributes, branch_attributes, sub_deals_attributes, info_deals_attributes, conditions_deals_attributes, cat_attributes, city_attributes;
var PurchaseRepository = {
    GetAll: function (id) {

        var data = {};
        if (id) {
            data = { user_id: id };
            return new Promise(function (resolve, reject) {

                if (lang.acceptedLanguage == 'en') {
                    city_attributes = [['name_ar', 'name']];
                    deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'is_monthly', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active', 'count_bought', 'terms_and_conditions', 'purchased_voucher', 'link_for_booking', 'is_prior_booking', 'prior_booking_message', 'attache_link', 'attache', 'deal_Inclusions', 'deal_Inclusions_link', 'deal_exclusions', 'deal_exclusions_link'];
                    branch_attributes = ['branch_id', ['name_en', 'name'], 'latitude', 'longitude', 'location_name', 'status', 'city_id', 'active'];
                    sub_deals_attributes = ['id', 'deal_id', ['title_en', 'title'], 'pre_price', 'new_price', 'count_bought'];
                } else {
                    city_attributes = [['name_ar', 'name']];
                    deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'is_monthly', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active', 'count_bought', 'terms_and_conditions', 'purchased_voucher', 'link_for_booking', 'is_prior_booking', 'prior_booking_message', 'attache_link', 'attache', 'deal_Inclusions', 'deal_Inclusions_link', 'deal_exclusions', 'deal_exclusions_link'];
                    branch_attributes = ['branch_id', ['name_ar', 'name'], 'latitude', 'longitude', 'location_name', 'status', 'city_id', 'active'];
                    sub_deals_attributes = ['id', 'deal_id', ['title_ar', 'title'], 'pre_price', 'new_price', 'count_bought'];
                }


                models.Purchase.belongsTo(models_deals.Deals, { foreignKey: 'deal_id' })
                models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' })
                models_deals.Deals.belongsTo(models_company.Company_Branches, { foreignKey: 'branch_id', targetKey: 'branch_id' });
                models_company.Company_Branches.belongsTo(models.Cities, { foreignKey: 'city_id', targetKey: 'city_id' });

                models.Purchase.findAll({
                    where: data, include: [
                        { model: models_deals.Deals, attributes: deal_attributes, include: [{ model: models_company.Company_Branches, attributes: branch_attributes, include: [{ model: models.Cities, attributes: city_attributes }] }] },
                        { model: models_sub_deals.SubDeals, attributes: sub_deals_attributes },

                    ]
                }).then(purchases => {
                    var pre_price_total = 0;
                    var new_price_subtotal = 0;
                    purchases.forEach(item => {
                        var pre_price_total_for_sub_deal = 0;
                        var new_price_subtotal_for_sub_deal = 0;


                        if (item["dataValues"].sub_deal) {

                            pre_price_total = pre_price_total + (item["dataValues"].sub_deal.pre_price * item["dataValues"].quantity);
                            new_price_subtotal = new_price_subtotal + (item["dataValues"].sub_deal.new_price * item["dataValues"].quantity);

                            pre_price_total_for_sub_deal = pre_price_total_for_sub_deal + (item["dataValues"].sub_deal.pre_price * item["dataValues"].quantity);
                            new_price_subtotal_for_sub_deal = new_price_subtotal_for_sub_deal + (item["dataValues"].sub_deal.new_price * item["dataValues"].quantity);

                        }
                        var diff = pre_price_total_for_sub_deal - new_price_subtotal_for_sub_deal;
                        var percDiff = 100 * Math.abs((new_price_subtotal_for_sub_deal - pre_price_total_for_sub_deal) / ((pre_price_total_for_sub_deal + new_price_subtotal_for_sub_deal) / 2));

                        item["dataValues"].pre_price_total = pre_price_total_for_sub_deal;
                        item["dataValues"].new_price_subtotal = new_price_subtotal_for_sub_deal;
                        item["dataValues"].diff = diff;
                        item["dataValues"].percDiff = percDiff;
                        item.dataValues['percDiff'] = percDiff.toString().split('.')[0] + "%";

                    });
                    var diff = pre_price_total - new_price_subtotal;
                    var percDiff = 100 * Math.abs((new_price_subtotal - pre_price_total) / ((pre_price_total + new_price_subtotal) / 2));
                    var response = {};
                    response.pre_price_total = pre_price_total;
                    response.new_price_subtotal = new_price_subtotal;
                    response.diff = diff;
                    response.percDiff = percDiff;
                    response.percDiff = percDiff.toString().split('.')[0] + "%";;
                    response.purchases = purchases;

                    resolve(response);
                }, error => {
                    reject(error);
                });
            });

        } else {
            return new Promise(function (resolve, reject) {
                models.Purchase.belongsTo(models_deals.Deals, { foreignKey: 'deal_id' })
                models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' })
                models_deals.Deals.belongsTo(models_company.Company_Branches, { foreignKey: 'branch_id', targetKey: 'branch_id' });
                models_company.Company_Branches.belongsTo(models.Cities, { foreignKey: 'city_id', targetKey: 'city_id' });

                models.Purchase.findAll({
                    include: [
                        { model: models_deals.Deals, include: [{ model: models_company.Company_Branches, attributes: branch_attributes, include: [{ model: models.Cities, attributes: city_attributes }]  }] },
                        { model: models_sub_deals.SubDeals },
                    ]
                }).then(purchases => {
                    resolve(purchases);
                }, error => {
                    reject(error);
                });
            });
        }

    },
    GetAllUsed: function (id) {
        if (lang.acceptedLanguage == 'en') {
            city_attributes = [['name_ar', 'name']];
            deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'is_monthly', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active', 'count_bought', 'terms_and_conditions', 'purchased_voucher', 'link_for_booking', 'is_prior_booking', 'prior_booking_message', 'attache_link', 'attache', 'deal_Inclusions', 'deal_Inclusions_link', 'deal_exclusions', 'deal_exclusions_link'];
            branch_attributes = ['branch_id', ['name_en', 'name'], 'latitude', 'longitude', 'location_name', 'status', 'city_id', 'active'];
            sub_deals_attributes = ['id', 'deal_id', ['title_en', 'title'], 'pre_price', 'new_price', 'count_bought'];
        } else {
            city_attributes = [['name_en', 'name']];
            deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'is_monthly', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active', 'count_bought', 'terms_and_conditions', 'purchased_voucher', 'link_for_booking', 'is_prior_booking', 'prior_booking_message', 'attache_link', 'attache', 'deal_Inclusions', 'deal_Inclusions_link', 'deal_exclusions', 'deal_exclusions_link'];
            branch_attributes = ['branch_id', ['name_ar', 'name'], 'latitude', 'longitude', 'location_name', 'status', 'city_id', 'active'];
            sub_deals_attributes = ['id', 'deal_id', ['title_ar', 'title'], 'pre_price', 'new_price', 'count_bought'];
        }
        models.Purchase.belongsTo(models_deals.Deals, { foreignKey: 'deal_id' })
        models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' })
        models_deals.Deals.belongsTo(models_company.Company_Branches, { foreignKey: 'branch_id', targetKey: 'branch_id' });
        models_deals.Deals.belongsTo(rating_model.Rating, { foreignKey: 'deal_id', targetKey: 'deal_id' });
        models_company.Company_Branches.belongsTo(models.Cities, { foreignKey: 'city_id', targetKey: 'city_id' });

        return new Promise(function (resolve, reject) {
            var data = {};
            if (id) {
                data = { status: 1, user_id: id };
            } else {
                data = { status: 1 };
            }
            models.Purchase.findAll({
                where: data, include: [
                    {
                        model: models_deals.Deals, attributes: deal_attributes, include: [{ model: models_company.Company_Branches, attributes: branch_attributes, include: [{ model: models.Cities, attributes: city_attributes }]  }, { model: rating_model.Rating, where: { user_id: id } }]
                    },
                    { model: models_sub_deals.SubDeals, attributes: sub_deals_attributes },

                ]
            }).then(purchases => {
                var pre_price_total = 0;
                var new_price_subtotal = 0;
                purchases.forEach(item => {
                    var pre_price_total_for_sub_deal = 0;
                    var new_price_subtotal_for_sub_deal = 0;


                    if (item["dataValues"].sub_deal) {

                        pre_price_total = pre_price_total + (item["dataValues"].sub_deal.pre_price * item["dataValues"].quantity);
                        new_price_subtotal = new_price_subtotal + (item["dataValues"].sub_deal.new_price * item["dataValues"].quantity);

                        pre_price_total_for_sub_deal = pre_price_total_for_sub_deal + (item["dataValues"].sub_deal.pre_price * item["dataValues"].quantity);
                        new_price_subtotal_for_sub_deal = new_price_subtotal_for_sub_deal + (item["dataValues"].sub_deal.new_price * item["dataValues"].quantity);

                    }
                    var diff = pre_price_total_for_sub_deal - new_price_subtotal_for_sub_deal;
                    var percDiff = 100 * Math.abs((new_price_subtotal_for_sub_deal - pre_price_total_for_sub_deal) / ((pre_price_total_for_sub_deal + new_price_subtotal_for_sub_deal) / 2));

                    item["dataValues"].pre_price_total = pre_price_total_for_sub_deal;
                    item["dataValues"].new_price_subtotal = new_price_subtotal_for_sub_deal;
                    item["dataValues"].diff = diff;
                    item["dataValues"].percDiff = percDiff;
                    item.dataValues['percDiff'] = percDiff.toString().split('.')[0] + "%";

                });
                var diff = pre_price_total - new_price_subtotal;
                var percDiff = 100 * Math.abs((new_price_subtotal - pre_price_total) / ((pre_price_total + new_price_subtotal) / 2));
                var response = {};
                response.pre_price_total = pre_price_total;
                response.new_price_subtotal = new_price_subtotal;
                response.diff = diff;
                response.percDiff = percDiff;
                response.percDiff = percDiff.toString().split('.')[0] + "%";;
                response.purchases = purchases;

                resolve(response);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllByDeal: function (deal_id) {

        models.Purchase.belongsTo(models_deals.Deals, { foreignKey: 'deal_id' })
        models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' })
        models.Purchase.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'user_admin_id' });
        models_deals.Deals.belongsTo(models_company.Company_Branches, { foreignKey: 'branch_id', targetKey: 'branch_id' });
        models_company.Company_Branches.belongsTo(models.Cities, { foreignKey: 'city_id', targetKey: 'city_id' });

        return new Promise(function (resolve, reject) {
            var data = {};
            data = { deal_id: deal_id };
            models.Purchase.findAll({
                where: data, include: [
                    { model: models_deals.Deals, include: [{ model: models_company.Company_Branches, attributes: branch_attributes, include: [{ model: models.Cities, attributes: city_attributes }]  }] },
                    { model: models_sub_deals.SubDeals },
                ]
            }).then(purchases => {
                resolve(purchases);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllUnused: function (id) {
        if (lang.acceptedLanguage == 'en') {
            city_attributes = [['name_en', 'name']];
            deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'is_monthly', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active', 'count_bought', 'terms_and_conditions', 'purchased_voucher', 'link_for_booking', 'is_prior_booking', 'prior_booking_message', 'attache_link', 'attache', 'deal_Inclusions', 'deal_Inclusions_link', 'deal_exclusions', 'deal_exclusions_link'];
            branch_attributes = ['branch_id', ['name_en', 'name'], 'latitude', 'longitude', 'location_name', 'status', 'city_id', 'active'];
            sub_deals_attributes = ['id', 'deal_id', ['title_en', 'title'], 'pre_price', 'new_price', 'count_bought'];
        } else {
            city_attributes = [['name_ar', 'name']];
            deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'is_monthly', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active', 'count_bought', 'terms_and_conditions', 'purchased_voucher', 'link_for_booking', 'is_prior_booking', 'prior_booking_message', 'attache_link', 'attache', 'deal_Inclusions', 'deal_Inclusions_link', 'deal_exclusions', 'deal_exclusions_link'];
            branch_attributes = ['branch_id', ['name_ar', 'name'], 'latitude', 'longitude', 'location_name', 'status', 'city_id', 'active'];
            sub_deals_attributes = ['id', 'deal_id', ['title_ar', 'title'], 'pre_price', 'new_price', 'count_bought'];
        }
        models.Purchase.belongsTo(models_deals.Deals, { foreignKey: 'deal_id' })
        models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' })
        models_deals.Deals.belongsTo(models_company.Company_Branches, { foreignKey: 'branch_id', targetKey: 'branch_id' });
        models_company.Company_Branches.belongsTo(models.Cities, { foreignKey: 'city_id', targetKey: 'city_id' });

        var data = {};
        if (id) {
            data = { status: 0, user_id: id };
        } else {
            data = { status: 0 };
        }
        return new Promise(function (resolve, reject) {
            models.Purchase.findAll({
                where: data, include: [
                    { model: models_deals.Deals, attributes: deal_attributes, include: [{ model: models_company.Company_Branches, attributes: branch_attributes, include: [{ model: models.Cities, attributes: city_attributes }]  }] },
                    { model: models_sub_deals.SubDeals, attributes: sub_deals_attributes },

                ]
            }).then(purchases => {
                var pre_price_total = 0;
                var new_price_subtotal = 0;
                purchases.forEach(item => {
                    var pre_price_total_for_sub_deal = 0;
                    var new_price_subtotal_for_sub_deal = 0;


                    if (item["dataValues"].sub_deal) {

                        pre_price_total = pre_price_total + (item["dataValues"].sub_deal.pre_price * item["dataValues"].quantity);
                        new_price_subtotal = new_price_subtotal + (item["dataValues"].sub_deal.new_price * item["dataValues"].quantity);

                        pre_price_total_for_sub_deal = pre_price_total_for_sub_deal + (item["dataValues"].sub_deal.pre_price * item["dataValues"].quantity);
                        new_price_subtotal_for_sub_deal = new_price_subtotal_for_sub_deal + (item["dataValues"].sub_deal.new_price * item["dataValues"].quantity);

                    }
                    var diff = pre_price_total_for_sub_deal - new_price_subtotal_for_sub_deal;
                    var percDiff = 100 * Math.abs((new_price_subtotal_for_sub_deal - pre_price_total_for_sub_deal) / ((pre_price_total_for_sub_deal + new_price_subtotal_for_sub_deal) / 2));

                    item["dataValues"].pre_price_total = pre_price_total_for_sub_deal;
                    item["dataValues"].new_price_subtotal = new_price_subtotal_for_sub_deal;
                    item["dataValues"].diff = diff;
                    item["dataValues"].percDiff = percDiff;
                    item.dataValues['percDiff'] = percDiff.toString().split('.')[0] + "%";

                });
                var diff = pre_price_total - new_price_subtotal;
                var percDiff = 100 * Math.abs((new_price_subtotal - pre_price_total) / ((pre_price_total + new_price_subtotal) / 2));
                var response = {};
                response.pre_price_total = pre_price_total;
                response.new_price_subtotal = new_price_subtotal;
                response.diff = diff;
                response.percDiff = percDiff;
                response.percDiff = percDiff.toString().split('.')[0] + "%";;
                response.purchases = purchases;

                resolve(response);
            }, error => {
                reject(error);
            });
        });
    },
    CreatePurchase: async function (newPurchaseData) {
        return new Promise(async function (resolve, reject) {
            models.Purchase.create({
                user_id: newPurchaseData.user_id,
                deal_id: newPurchaseData.deal_id,
                sub_deal_id: newPurchaseData.sub_deal_id,
                status: newPurchaseData.status,
                date: newPurchaseData.date,
                quantity: newPurchaseData.quantity
            }).then(async account => {
                resolve(account);

                models.Purchase.findAll({
                    attributes: ['sub_deal_id']
                    , where: { sub_deal_id: newPurchaseData.sub_deal_id }
                }).then(purchases => {
                    if (purchases == null) {
                        resolve(null);
                    } else {

                        models_sub_deals.SubDeals.findOne({
                            attributes: ['count_bought']
                            , where: { id: newPurchaseData.sub_deal_id }
                        }).then(count_bought => {
                            if (count_bought == null) {
                                resolve(null);
                            } else {
                                var count = count_bought.dataValues.count_bought + 1;
                                models_sub_deals.SubDeals.update(
                                    { count_bought: count }, { where: { id: newPurchaseData.sub_deal_id } }
                                ).then(function (result) {
                                    resolve(result);
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


            }, error => {
                reject(error)
            });
        });
    },
    CreatePurchaseMany: async function (newPurchaseData) {
        return new Promise(async function (resolve, reject) {
            var pruchases = [];
            for (let k in newPurchaseData) {
                console.log(newPurchaseData[k])
                var purchase = await PurchaseRepository.CreatePurchase({ user_id: newPurchaseData[k].user_id, deal_id: newPurchaseData[k].deal_id, sub_deal_id: newPurchaseData[k].sub_deal_id, status: newPurchaseData[k].status, date: newPurchaseData[k].date, quantity: newPurchaseData[k].quantity });
                pruchases.push(purchase);
            }
            resolve(pruchases)
        });
    },
    DeletePurchase: function (purchase_id) {
        return new Promise(function (resolve, reject) {
            models.Purchase.destroy({ where: { purchase_id: purchase_id } }).then(response => {
                if (response) {
                    resolve(null);
                } else {
                    resolve(response);
                }
            }, error => {
                reject(error);
            });
        });
    }

};
Object.assign(PurchaseRepository, commonRepository);
module.exports = PurchaseRepository;