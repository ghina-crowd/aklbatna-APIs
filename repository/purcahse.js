var constant = require('../constant/enums');
var models = require('../models/models.js');
var models_deals = require('../models/deals_model');
var models_company = require('../models/company_model');
var rating_model = require('../models/rating_model');
var models_sub_deals = require('../models/sub_deals_model');
var commonRepository = require('./common.js');
var lang = require('../app');
var QRCode = require('qrcode')
const sequelize = require('sequelize');
const Op = sequelize.Op;

const { createInvoice, createTransaction } = require("../util/createInvoice");

var deal_attributes, branch_attributes, sub_deals_attributes, info_deals_attributes, conditions_deals_attributes, company_attributes, city_attributes;
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
                    company_attributes = ['company_id', ['company_name_en', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link', 'cost_type'];

                } else {
                    city_attributes = [['name_ar', 'name']];
                    deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'is_monthly', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active', 'count_bought', 'terms_and_conditions', 'purchased_voucher', 'link_for_booking', 'is_prior_booking', 'prior_booking_message', 'attache_link', 'attache', 'deal_Inclusions', 'deal_Inclusions_link', 'deal_exclusions', 'deal_exclusions_link'];
                    branch_attributes = ['branch_id', ['name_ar', 'name'], 'latitude', 'longitude', 'location_name', 'status', 'city_id', 'active'];
                    sub_deals_attributes = ['id', 'deal_id', ['title_ar', 'title'], 'pre_price', 'new_price', 'count_bought'];
                    company_attributes = ['company_id', ['company_name_ar', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_ar', 'description'], 'website_link', 'cost_type'];

                }


                models.Purchase.belongsTo(models_deals.Deals, { foreignKey: 'deal_id' });
                models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' });
                models_deals.Deals.belongsTo(models_company.Company, { foreignKey: 'company_id', targetKey: 'company_id' });
                models_deals.Deals.belongsTo(models_company.Company_Branches, { foreignKey: 'branch_id', targetKey: 'branch_id' });
                models_company.Company_Branches.belongsTo(models.Cities, { foreignKey: 'city_id', targetKey: 'city_id' });

                models.Purchase.findAll({
                    where: data, include: [
                        { model: models_deals.Deals, attributes: deal_attributes, include: [{ model: models_company.Company_Branches, attributes: branch_attributes, include: [{ model: models.Cities, attributes: city_attributes }] }, { model: models_company.Company, attributes: company_attributes }] },
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
                models.Purchase.belongsTo(models_deals.Deals, { foreignKey: 'deal_id' });
                models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' });
                models_deals.Deals.belongsTo(models_company.Company, { foreignKey: 'company_id', targetKey: 'company_id' });
                models_deals.Deals.belongsTo(models_company.Company_Branches, { foreignKey: 'branch_id', targetKey: 'branch_id' });
                models_company.Company_Branches.belongsTo(models.Cities, { foreignKey: 'city_id', targetKey: 'city_id' });

                models.Purchase.findAll({
                    include: [
                        { model: models_deals.Deals, include: [{ model: models_company.Company }] },
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
    getOrders: function (status, page) {


        var pageSize = 12; // page start from 0
        const offset = page * pageSize;

        var data = {};

        if (status === 0) {
            // data.date = {
            //     // [Op.gte]: new Date(Date.now() - ((60 * 60 * 1000) * 24)),
            // }
            data.payment_status = status;

            return new Promise(function (resolve, reject) {

                models.Order.hasMany(models.Purchase, { foreignKey: 'order_id' });
                models.Purchase.belongsTo(models_deals.Deals, { foreignKey: 'deal_id' });
                models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' });
                models.Purchase.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'user_admin_id' });
                models_deals.Deals.belongsTo(models_company.Company, { foreignKey: 'company_id', targetKey: 'company_id' });
                models_deals.Deals.belongsTo(models_company.Company_Branches, { foreignKey: 'branch_id', targetKey: 'branch_id' });
                models_company.Company_Branches.belongsTo(models.Cities, { foreignKey: 'city_id', targetKey: 'city_id' });

                console.log(data);
                models.Order.findAll({
                    where: data,
                    //  limit: pageSize, offset: offset,
                    include: [{
                        model: models.Purchase, include: [
                            { model: models_deals.Deals, include: [{ model: models_company.Company_Branches, include: [{ model: models.Cities }] }, { model: models_company.Company }] },
                            { model: models_sub_deals.SubDeals }, { model: models.User, attributes: ['email', 'first_name', 'last_name', 'phone', 'subscribe'] },
                        ]
                    }]
                }).then(orders => {



                    // var reviewsTemp = orders.rows;
                    // orders.orders = reviewsTemp;
                    // delete orders.rows;


                    orders.forEach(element => {

                        var checkDate = new Date(Date.now() - ((60 * 60 * 1000) * 24));
                        var orderDate = new Date(element['dataValues'].date);
                        console.log(checkDate);
                        console.log(orderDate);
                        if (orderDate.getTime() < checkDate.getTime()) {
                            element['dataValues'].expire = 1;
                        } else {
                            element['dataValues'].expire = 0;
                        }


                    });

                    resolve(orders);
                }, error => {
                    reject(error);
                });
            });
        } else {
            data.payment_status = status;
            return new Promise(function (resolve, reject) {

                models.Purchase.belongsTo(models.Order, { foreignKey: 'order_id' });
                models.Purchase.belongsTo(models_deals.Deals, { foreignKey: 'deal_id' });
                models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' });
                models.Purchase.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'user_admin_id' });
                models_deals.Deals.belongsTo(models_company.Company, { foreignKey: 'company_id', targetKey: 'company_id' });
                models_deals.Deals.belongsTo(models_company.Company_Branches, { foreignKey: 'branch_id', targetKey: 'branch_id' });
                models_company.Company_Branches.belongsTo(models.Cities, { foreignKey: 'city_id', targetKey: 'city_id' });

                console.log(data);
                models.Purchase.findAndCountAll({
                    limit: pageSize, offset: offset,
                    include: [
                        { model: models_deals.Deals, include: [{ model: models_company.Company_Branches, include: [{ model: models.Cities }] }, { model: models_company.Company }] },
                        { model: models_sub_deals.SubDeals }, { model: models.Order, where: data }, { model: models.User, attributes: ['email', 'first_name', 'last_name', 'phone', 'subscribe'] },
                    ]
                }).then(orders => {

                    var reviewsTemp = orders.rows;
                    orders.orders = reviewsTemp;
                    delete orders.rows;

                    resolve(orders);
                }, error => {
                    reject(error);
                });
            });
        }


    },
    GetAllUsed: function (id) {
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
            data = { status: 1, user_id: id };
        } else {
            data = { status: 1 };
        }
        return new Promise(function (resolve, reject) {
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
                    { model: models_deals.Deals, include: [{ model: models_company.Company_Branches, attributes: branch_attributes, include: [{ model: models.Cities, attributes: city_attributes }] }] },
                    { model: models_sub_deals.SubDeals }, { model: models.User, attributes: ['user_admin_id', 'first_name', 'last_name', 'phone', 'active'] },
                ]
            }).then(purchases => {
                resolve(purchases);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllByCompany: function (company_id) {
        models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' })
        return new Promise(function (resolve, reject) {
            var data = {};
            data = { company_id: company_id };
            models.Purchase.findAll({
                where: data, include: [
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
    },
    GetPurchase: async function (purchase_id) {



        return new Promise(async function (resolve, reject) {

            if (lang.acceptedLanguage == 'en') {
                city_attributes = [['name_ar', 'name']];
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'is_monthly', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active', 'count_bought', 'terms_and_conditions', 'purchased_voucher', 'link_for_booking', 'is_prior_booking', 'prior_booking_message', 'attache_link', 'attache', 'deal_Inclusions', 'deal_Inclusions_link', 'deal_exclusions', 'deal_exclusions_link'];
                branch_attributes = ['branch_id', ['name_en', 'name'], 'latitude', 'longitude', 'location_name', 'status', 'city_id', 'active'];
                sub_deals_attributes = ['id', 'deal_id', ['title_en', 'title'], 'pre_price', 'new_price', 'count_bought'];
                company_attributes = ['company_id', ['company_name_en', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link', 'cost_type'];

            } else {
                city_attributes = [['name_ar', 'name']];
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'is_monthly', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active', 'count_bought', 'terms_and_conditions', 'purchased_voucher', 'link_for_booking', 'is_prior_booking', 'prior_booking_message', 'attache_link', 'attache', 'deal_Inclusions', 'deal_Inclusions_link', 'deal_exclusions', 'deal_exclusions_link'];
                branch_attributes = ['branch_id', ['name_ar', 'name'], 'latitude', 'longitude', 'location_name', 'status', 'city_id', 'active'];
                sub_deals_attributes = ['id', 'deal_id', ['title_ar', 'title'], 'pre_price', 'new_price', 'count_bought'];
                company_attributes = ['company_id', ['company_name_ar', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_ar', 'description'], 'website_link', 'cost_type'];

            }


            models.Purchase.belongsTo(models_deals.Deals, { foreignKey: 'deal_id' });
            models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' });
            models_deals.Deals.belongsTo(models_company.Company, { foreignKey: 'company_id', targetKey: 'company_id' });
            models_deals.Deals.belongsTo(models_company.Company_Branches, { foreignKey: 'branch_id', targetKey: 'branch_id' });
            models_company.Company_Branches.belongsTo(models.Cities, { foreignKey: 'city_id', targetKey: 'city_id' });

            models.Purchase.findOne({
                where: { purchase_id: purchase_id }, include: [
                    { model: models_deals.Deals, attributes: deal_attributes, include: [{ model: models_company.Company_Branches, attributes: branch_attributes, include: [{ model: models.Cities, attributes: city_attributes }] }, { model: models_company.Company, attributes: company_attributes }] },
                    { model: models_sub_deals.SubDeals, attributes: sub_deals_attributes },

                ]
            }).then(purchases => {
                // var pre_price_total = 0;
                // var new_price_subtotal = 0;
                // var diff = pre_price_total - new_price_subtotal;
                // var percDiff = 100 * Math.abs((new_price_subtotal - pre_price_total) / ((pre_price_total + new_price_subtotal) / 2));
                // var response = {};
                // response.pre_price_total = pre_price_total;
                // response.new_price_subtotal = new_price_subtotal;
                // response.diff = diff;
                // response.percDiff = percDiff;
                // response.percDiff = percDiff.toString().split('.')[0] + "%";;
                // response.purchases = purchases;

                resolve(purchases);
            }, error => {
                reject(error);
            });
        });
    },
    GetPurchaseByOrder_id: async function (order_id) {



        return new Promise(async function (resolve, reject) {

            if (lang.acceptedLanguage == 'en') {
                city_attributes = [['name_ar', 'name']];
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'is_monthly', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active', 'count_bought', 'terms_and_conditions', 'purchased_voucher', 'link_for_booking', 'is_prior_booking', 'prior_booking_message', 'attache_link', 'attache', 'deal_Inclusions', 'deal_Inclusions_link', 'deal_exclusions', 'deal_exclusions_link'];
                branch_attributes = ['branch_id', ['name_en', 'name'], 'latitude', 'longitude', 'location_name', 'status', 'city_id', 'active'];
                sub_deals_attributes = ['id', 'deal_id', ['title_en', 'title'], 'pre_price', 'new_price', 'count_bought'];
                company_attributes = ['company_id', ['company_name_en', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link', 'cost_type'];

            } else {
                city_attributes = [['name_ar', 'name']];
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'is_monthly', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active', 'count_bought', 'terms_and_conditions', 'purchased_voucher', 'link_for_booking', 'is_prior_booking', 'prior_booking_message', 'attache_link', 'attache', 'deal_Inclusions', 'deal_Inclusions_link', 'deal_exclusions', 'deal_exclusions_link'];
                branch_attributes = ['branch_id', ['name_ar', 'name'], 'latitude', 'longitude', 'location_name', 'status', 'city_id', 'active'];
                sub_deals_attributes = ['id', 'deal_id', ['title_ar', 'title'], 'pre_price', 'new_price', 'count_bought'];
                company_attributes = ['company_id', ['company_name_ar', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_ar', 'description'], 'website_link', 'cost_type'];

            }


            models.Purchase.belongsTo(models_deals.Deals, { foreignKey: 'deal_id' });
            models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' });
            models_deals.Deals.belongsTo(models_company.Company, { foreignKey: 'company_id', targetKey: 'company_id' });
            models_deals.Deals.belongsTo(models_company.Company_Branches, { foreignKey: 'branch_id', targetKey: 'branch_id' });
            models_company.Company_Branches.belongsTo(models.Cities, { foreignKey: 'city_id', targetKey: 'city_id' });

            models.Purchase.findAll({
                where: { order_id: order_id }, include: [
                    { model: models_deals.Deals, attributes: deal_attributes, include: [{ model: models_company.Company_Branches, attributes: branch_attributes, include: [{ model: models.Cities, attributes: city_attributes }] }, { model: models_company.Company, attributes: company_attributes }] },
                    { model: models_sub_deals.SubDeals, attributes: sub_deals_attributes },

                ]
            }).then(purchases => {
                var pre_price_total = 0;
                var new_price_subtotal = 0;
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
    CreatePurchase: async function (newPurchaseData, checklength, check, order) {

        var Code = Number(newPurchaseData.deal_id) + '-' + Number(newPurchaseData.sub_deal_id) + '-' + new Date().getTime() * (Number(newPurchaseData.user_id));
        QRCode.toDataURL(Code.toString(), async function (err, url) {
            console.log(url)
            return new Promise(async function (resolve, reject) {
                models.Purchase.create({
                    user_id: newPurchaseData.user_id,
                    deal_id: newPurchaseData.deal_id,
                    sub_deal_id: newPurchaseData.sub_deal_id,
                    status: 0,
                    date: newPurchaseData.date,
                    quantity: newPurchaseData.quantity,
                    qrcode: Code,
                    image: url,
                    company_id: newPurchaseData.company_id,
                    order_id: order['dataValues'].order_id
                }).then(async purchase => {
                    resolve(purchase);
                    models.User.findOne({
                        where: { user_admin_id: newPurchaseData.user_id }
                    }).then(async User => {
                        if (User == null) {
                            resolve(null);
                        } else {
                            let allPurcahsesbyOrder = await PurchaseRepository.GetPurchaseByOrder_id(order['dataValues'].order_id)
                            console.log((Number(check) + 1))
                            console.log((Number(check) + 1) === allPurcahsesbyOrder.purchases.length)
                            if (String(order['dataValues'].payment_type) !== '1') {
                                if ((Number(check) + 1) === allPurcahsesbyOrder.purchases.length) {
                                    PurchaseRepository.SendTransaction(User, allPurcahsesbyOrder, order);
                                }
                            }
                        }
                    }, error => {
                        reject(error);
                    });

                }, error => {
                    reject(error)
                });
            });
        });

    },
    UpdateOrder: async function (newPurchaseData, id) {


        return new Promise(async function (resolve, reject) {
            models.Order.update({
                payment_status: newPurchaseData.payment_status,
            }, { where: { order_id: newPurchaseData.order_id } }).then(async purchase => {
                resolve(purchase);
                models.User.findOne({
                    where: { user_admin_id: newPurchaseData.user_id }
                }).then(async User => {
                    if (User == null) {
                        resolve(null);
                    } else {
                        let allPurcahses = await PurchaseRepository.GetPurchaseByOrder_id(newPurchaseData.order_id);
                        console.log('newPurchaseData', allPurcahses);
                        PurchaseRepository.MakeInvoice(User, allPurcahses.purchases);
                        if (newPurchaseData.payment_status + "" === '1') {

                            for (let k in allPurcahses.purchases) {
                                console.log(allPurcahses.purchases[k].dataValues.sub_deal.dataValues.id);
                                await PurchaseRepository.UpdateBoughtCount(allPurcahses.purchases[k].dataValues.sub_deal.dataValues.id);
                            }

                        }
                    }
                }, error => {
                    reject(error);
                });

            }, error => {
                reject(error)
            });
        });

    },
    UpdateBoughtCount: async function (sub_deal_id) {



        return new Promise(async function (resolve, reject) {

            models.Purchase.findAll({
                attributes: ['sub_deal_id']
                , where: { sub_deal_id: sub_deal_id }
            }).then(purchases => {
                if (purchases == null) {
                    resolve(null);
                } else {

                    models_sub_deals.SubDeals.findOne({
                        attributes: ['count_bought']
                        , where: { id: sub_deal_id }
                    }).then(count_bought => {
                        if (count_bought == null) {
                            resolve(null);
                        } else {
                            var count = count_bought.dataValues.count_bought + 1;
                            models_sub_deals.SubDeals.update(
                                { count_bought: count }, { where: { id: sub_deal_id } }
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
        });


    },
    CreatePurchaseMany: async function (newPurchaseData, id) {


        let payment_type = JSON.parse(JSON.stringify(newPurchaseData, null, 2)).payment_type;
        let price = JSON.parse(JSON.stringify(newPurchaseData, null, 2)).price;
        let extra_charges = JSON.parse(JSON.stringify(newPurchaseData, null, 2)).extra_charges;
        newPurchaseData = JSON.parse(JSON.stringify(newPurchaseData, null, 2)).Purchase;


        // console.log({
        //     payment_type: payment_type,
        //     user_id: id,
        //     payment_status: 0,
        //     price: price,
        //     extra_charges: extra_charges,
        // })



        return new Promise(function (resolve, reject) {
            models.Order.create({
                payment_type: payment_type,
                user_id: id,
                payment_status: 0,
                price: price,
                extra_charges: extra_charges,
                transaction: 0,
            }).then(async order => {

                var pruchases = [];
                var allPurcahses = [];
                for (let k in newPurchaseData) {
                    var purchase = await PurchaseRepository.CreatePurchase({ user_id: id, deal_id: newPurchaseData[k].deal_id, sub_deal_id: newPurchaseData[k].sub_deal_id, status: newPurchaseData[k].status, date: new Date().toISOString(), quantity: newPurchaseData[k].quantity }, newPurchaseData, k, order);
                    console.log(purchase);
                    pruchases.push(newPurchaseData[k]);
                }
                order['dataValues'].transaction = 100000 + order['dataValues'].order_id;
                order['dataValues'].pruchases = pruchases;
                resolve(order)
            }, error => {
                reject(error)
            });
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
    },
    DeleteOrder: function (order_id) {
        console.log(order_id)
        return new Promise(function (resolve, reject) {
            models.Order.destroy({ where: { order_id: order_id } }).then(response => {
                if (!response) {
                    models.Purchase.destroy({ where: { order_id: order_id } }).then(response => {
                        if (!response) {
                            resolve(null);
                        } else {
                            resolve(response);
                        }
                    }, error => {
                        reject(error);
                    });
                } else {
                    models.Purchase.destroy({ where: { order_id: order_id } }).then(response => {
                        if (!response) {
                            resolve(null);
                        } else {
                            resolve(response);
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
    UpdatePurchase: function (newPurchaseData) {

        return new Promise(function (resolve, reject) {
            models.Purchase.update({
                status: newPurchaseData.status

            }, { where: { qr_code: newPurchaseData.qr_code, user_id: newPurchaseData.request_from, status: "0" } }).then(
                response => {
                    if (response[0] == 1) {
                        // QR code used
                        models.Requests.create
                            ({
                                request_from: newPurchaseData.request_from,
                                request_to: newPurchaseData.qr_code,
                                first_name: newPurchaseData.first_name,
                                last_name: newPurchaseData.last_name,
                                phone: newPurchaseData.phone,
                                type: constant.Redeemed,
                                status: constant.USED,
                                created_date: Date.now()
                            }).then(account => {
                                if (account)
                                    resolve({ status: 1 });
                            })
                    }
                    else {
                        resolve({ status: -1 }) // invalid QR code
                    }

                },
                error => {
                    reject(error);
                });

        });
    },
    MakeInvoice: async function (user, purcahse) {

        let paid = 0;
        for (let k in purcahse) {

            const invoice = {
                shipping: {
                    name: user['dataValues'].first_name + ' ' + user['dataValues'].last_name,
                    address: user['dataValues'].email,
                    city: 'Irbid',
                    state: "Jordan",
                    country: user['dataValues'].phone,
                },
                items: [{
                    item: (k + 1).toString(),
                    description: purcahse[k].dataValues.sub_deal.dataValues.title.length > 35 ? purcahse[k].dataValues.sub_deal.dataValues.title.substring(0, 35) + "..." : purcahse[k].dataValues.sub_deal.dataValues.title,
                    quantity: purcahse[k].dataValues.quantity,
                    amount: purcahse[k].dataValues.sub_deal.dataValues.new_price
                }],
                subtotal: purcahse[k].dataValues.sub_deal.dataValues.new_price,
                paid: paid,
                invoice_nr: purcahse[k].dataValues.purchase_id,
                barCode: purcahse[k].dataValues.image,
                subtotal: purcahse[k].dataValues.sub_deal.dataValues.new_price,
                paid: 0,
                extra_charges: 0,
                total: purcahse[k].dataValues.sub_deal.dataValues.new_price,
            };

            createInvoice(invoice, './images/invoices/' + new Date().getTime() + ".pdf");

        }






    },
    SendTransaction: async function (user, purchases, order) {


        let extra_charges = Number(order['dataValues'].extra_charges);
        let subtotal = 0;
        let total = 0;
        let items = [];
        let purcahse = purchases.purchases;
        console.log(purcahse);
        for (let k in purcahse) {
            items.push({
                item: (k + 1).toString(),
                description: purcahse[k].dataValues.sub_deal.dataValues.title.length > 35 ? purcahse[k].dataValues.sub_deal.dataValues.title.substring(0, 35) + "..." : purcahse[k].dataValues.sub_deal.dataValues.title,
                quantity: purcahse[k].dataValues.quantity,
                amount: purcahse[k].dataValues.sub_deal.dataValues.new_price
            })
            subtotal = subtotal + (purcahse[k].dataValues.sub_deal.dataValues.new_price * purcahse[k].dataValues.quantity);
            total = total + (purcahse[k].dataValues.sub_deal.dataValues.new_price * purcahse[k].dataValues.quantity);
        }
        total = extra_charges + total;

        const invoice = {
            shipping: {
                name: user['dataValues'].first_name + ' ' + user['dataValues'].last_name,
                address: user['dataValues'].email,
                city: 'Irbid',
                state: "Jordan",
                country: user['dataValues'].phone,
            },
            items: items,
            subtotal: subtotal,
            paid: 0,
            extra_charges: extra_charges,
            total: total,
            invoice_nr: 100000 + order['dataValues'].order_id,
            bank: 'HBL Bank',
            account: '45677545678765',
            account_title: 'Coboney',
            payment_type: order['dataValues'].payment_type,
        };
        createTransaction(invoice, './images/invoices/' + new Date().getTime() + ".pdf");

    }
}

Object.assign(PurchaseRepository, commonRepository);
module.exports = PurchaseRepository;