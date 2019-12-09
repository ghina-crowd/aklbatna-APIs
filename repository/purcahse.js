var models = require('../models/models.js');
var commonRepository = require('./common.js');

var PurchaseRepository = {
    GetAll: function () {
        return new Promise(function (resolve, reject) {
            models.Purchase.findAll().then(purcahses => {
                resolve(purcahses);
            }, error => {
                reject(error);
            });
        });
    },


    GetAllUsed: function () {
        return new Promise(function (resolve, reject) {
            models.Purchase.findAll({ where: { status: 1 } }).then(purcahses => {
                resolve(purcahses);
            }, error => {
                reject(error);
            });
        });
    },



    GetAllUnused: function () {
        return new Promise(function (resolve, reject) {
            models.Purchase.findAll({ where: { status: 0 } }).then(purcahses => {
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