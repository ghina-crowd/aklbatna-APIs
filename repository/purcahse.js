var models = require('../models/models.js');
var commonRepository = require('./common.js');

var PurchaseRepository = {
    GetAll: function (delted) {
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
            models.Purchase.findAll({ where: { status: 0 } }).then(purcahses => {
                resolve(purcahses);
            }, error => {
                reject(error);
            });
        });
    },



    GetAllUnused: function (deleted) {
        return new Promise(function (resolve, reject) {
            models.Purchase.findAll({ where: { status: 1 } }).then(purcahses => {
                resolve(purcahses);
            }, error => {
                reject(error);
            });
        });
    },

    createAccount: function (newAccountData) {
        return new Promise(function (resolve, reject) {
            models.Purchase.findOne({ attributes: ['pk_account_id'], where: { fk_user_id: newAccountData.fk_user_id } }).then(account => {
                if (account == null) {
                    models.Account.create({
                        fk_user_id: newAccountData.fk_user_id,
                        owner_name: newAccountData.owner_name,
                        cvc: newAccountData.cvc,
                        expiry_date: newAccountData.expiry_date,
                        card_number: newAccountData.card_number,
                        type: newAccountData.type,
                    }).then(account => {
                        console.log(account['dataValues']);
                        resolve(account);
                    }, error => {
                        reject(error)
                    });
                } else {
                    resolve(null)
                }
            }, error => {
                reject(error);
            });
        });
    },

};
Object.assign(PurchaseRepository, commonRepository);
module.exports = PurchaseRepository;