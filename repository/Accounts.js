var models = require('../models/models.js');
var commonRepository = require('./common.js');

var AccountRepository = {
    FindAllByDeleted: function (deleted) {
        return new Promise(function (resolve, reject) {
            models.Account.findAll({ where: { deleted: deleted } }).then(existingCountries => {
                resolve(existingCountries);
            }, error => {
                reject(error);
            });
        });
    },
    getAccount: function (user_id) {
        return new Promise(function (resolve, reject) {
            models.Accounts.findAll({ where: { user_id: user_id } }).then((account => {
                if (account == null) {
                    resolve(null);
                } else {
                    resolve(account);
                }
            }), error => {
                reject(error);
            })
        });
    },

    createAccount: function (newAccountData) {
        return new Promise(function (resolve, reject) {
            models.Accounts.findOne({ where: { card_number: newAccountData.card_number } }).then(account => {
                if (account == null) {
                    models.Accounts.create({
                        user_id: newAccountData.user_id,
                        owner_name: newAccountData.owner_name,
                        cvc: newAccountData.cvc,
                        expiry_date: newAccountData.expiry_date,
                        card_number: newAccountData.card_number,
                        type: newAccountData.type,
                    }).then(account => {
                        resolve(account);
                    }, error => {
                        reject(error)
                    });
                } else {
                    resolve(account['dataValues'])
                }
            }, error => {
                reject(error);
            });
        });
    },


    checkAccount: function (newAccountData) {
        return new Promise(function (resolve, reject) {
            models.Accounts.findOne({ where: { card_number: newAccountData.card_number } }).then(account => {
                if (account == null) {
                    resolve(null);
                } else {
                    resolve(account['dataValues'])
                }
            }, error => {
                reject(error);
            });
        });
    },


    updateAccount: function (newAccountData) {
        return new Promise(function (resolve, reject) {
            models.Accounts.update({

                owner_name: newAccountData.owner_name,
                cvc: newAccountData.cvc,
                expiry_date: newAccountData.expiry_date,
                card_number: newAccountData.card_number,
                type: newAccountData.type,

            }, { where: { account_id: newAccountData.account_id } }).then(function (result) {
                models.Accounts.findOne({ where: { account_id: newAccountData.account_id }, attributes: ['owner_name', 'cvc', 'expiry_date', 'card_number', 'type'] }).then(account => {
                    resolve(account);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },
    deleteAccount: function (account_id) {
        return new Promise(function (resolve, reject) {
            models.Accounts.destroy({ where: { account_id: account_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    }

};
Object.assign(AccountRepository, commonRepository);
module.exports = AccountRepository;