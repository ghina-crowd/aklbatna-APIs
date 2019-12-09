var models = require('../models/models.js');
var commonRepository = require('./common.js');

var PurchaseRepository = {
    GetAll: function (id) {

        var data = {};
        if (id) {
            data = { user_id: id };
        } else {
            data = {};
        }
        return new Promise(function (resolve, reject) {
            models.Purchase.findAll({ where: data }).then(purcahses => {
                resolve(purcahses);
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