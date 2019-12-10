var models = require('../models/models.js');
var modelsdeals = require('../models/deals_model');
var commonRepository = require('./common.js');

var PurchaseRepository = {
    GetAll: function (id) {

        var data = {};
        if (id) {
            data = { user_id: id };
            return new Promise(function (resolve, reject) {
                models.Purchase.belongsTo(modelsdeals.Deals, { foreignKey: 'deal_id' })
                models.Purchase.findAll({
                    where: data, include: [
                        { model: modelsdeals.Deals },
                    ]
                }).then(purcahses => {
                    var pre_price_total = 0;
                    var new_price_subtotal = 0;
                    purcahses.forEach(item => {
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
                    response.purcahses = purcahses;

                    resolve(response);
                }, error => {
                    reject(error);
                });
            });

        } else {
            return new Promise(function (resolve, reject) {
                models.Purchase.findAll().then(purcahses => {
                    resolve(purcahses);
                }, error => {
                    reject(error);
                });
            });
        }

    },


    GetAllUsed: function (id) {
        return new Promise(function (resolve, reject) {
            var data = {};
            if (id) {
                data = { status: 1, user_id: id };
            } else {
                data = { status: 1 };
            }
            models.Purchase.findAll({ where: data }).then(purcahses => {
                resolve(purcahses);
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
        return new Promise(function (resolve, reject) {
            models.Purchase.findAll({ where: data }).then(purcahses => {
                resolve(purcahses);
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
                status: newPurchaseData.status,
                date: newPurchaseData.date
            }).then(account => {
                console.log(account['dataValues']);
                resolve(account);
            }, error => {
                reject(error)
            });
        });
    }


};
Object.assign(PurchaseRepository, commonRepository);
module.exports = PurchaseRepository;