var models = require('../models/models.js');
var models_deals = require('../models/deals_model');
var models_company = require('../models/company_model');
var models_sub_deals = require('../models/sub_deals_model');
var commonRepository = require('./common.js');

var PurchaseRepository = {
    GetAll: function (id) {

        var data = {};
        if (id) {
            data = { user_id: id };
            return new Promise(function (resolve, reject) {
                models.Purchase.belongsTo(models_deals.Deals, { foreignKey: 'deal_id' })
                models.Purchase.findAll({
                    where: data, include: [
                        { model: models_deals.Deals },
                    ]
                }).then(purchases => {
                    var pre_price_total = 0;
                    var new_price_subtotal = 0;
                    purchases.forEach(item => {
                        pre_price_total = pre_price_total + item["dataValues"].deal.pre_price;
                        new_price_subtotal = new_price_subtotal + item["dataValues"].deal.new_price;
                    });
                    var diff = pre_price_total - new_price_subtotal;
                    var percDiff = 100 * Math.abs((new_price_subtotal - pre_price_total) / ((pre_price_total + new_price_subtotal) / 2));
                    var response = {};
                    response.pre_price_total = pre_price_total;
                    response.new_price_subtotal = new_price_subtotal;
                    response.diff = diff;
                    response.percDiff = percDiff;
                    response.purchases = purchases;

                    resolve(response);
                }, error => {
                    reject(error);
                });
            });

        } else {
            return new Promise(function (resolve, reject) {
                models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' })
                models.Purchase.findAll({ include: [{ model: models_sub_deals.SubDeals }] }).then(purchases => {
                    resolve(purchases);
                }, error => {
                    reject(error);
                });
            });
        }

    },
    GetAllCompany: function (company_id) {
        var data = {};
        data = { company_id: company_id };
        return new Promise(function (resolve, reject) {
            models.Purchase.belongsTo(models_deals.Deals, { foreignKey: 'deal_id' })
            models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' })
            models.Purchase.belongsTo(models.User, { foreignKey: 'user_id' })
            models_deals.Deals.belongsTo(models_company.Company, { foreignKey: 'company_id' })
            models.Purchase.findAll({
                include: [
                    {
                        model: models_deals.Deals,
                        include: [
                            { where: data, model: models_company.Company },
                        ]
                    }
                    ,
                    { model: models_sub_deals.SubDeals }
                    ,
                    { model: models.User }
                ]
            }).then(purchases => {
                for (let k in purchases) {
                    if (!purchases[k]['dataValues'].deal) {
                        delete purchases[k];
                    }
                }

                var filtered = purchases.filter(function (el) {
                    return el != null;
                });
                resolve(filtered);
            }, error => {
                reject(error);
            });
        });
    },


    GetAllUsed: function (id) {
        return new Promise(function (resolve, reject) {
            var data = {};
            if (id) {
                data = { status: 1, user_id: id };
            } else {
                data = { status: 1 };
            }
            models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' })
            models.Purchase.findAll({ where: data, include: [{ model: models_sub_deals.SubDeals }] }).then(purchases => {
                resolve(purchases);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllUnused: function (id) {

        var data = {};
        if (id) {
            data = { status: 0, user_id: id };
        } else {
            data = { status: 0 };
        }
        console.log(data);
        return new Promise(function (resolve, reject) {
            models.Purchase.belongsTo(models_sub_deals.SubDeals, { foreignKey: 'sub_deal_id' })
            models.Purchase.findAll({ where: data, include: [{ model: models_sub_deals.SubDeals }] }).then(purchases => {
                resolve(purchases);
            }, error => {
                reject(error);
            });
        });
    },
    CreatePurchase: function (newPurchaseData) {
        return new Promise(function (resolve, reject) {
            models.Purchase.create({
                user_id: newPurchaseData.user_id,
                deal_id: newPurchaseData.deal_id,
                sub_deal_id: newPurchaseData.sub_deal_id,
                status: newPurchaseData.status,
                date: newPurchaseData.date
            }).then(account => {
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