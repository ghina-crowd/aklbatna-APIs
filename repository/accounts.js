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
    getAccount: function (pk_account_id) {
        return new Promise(function (resolve, reject) {
            models.Account.findOne({ where: { pk_account_id: pk_account_id } }).then((account => {
                console.log(account);
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
            models.Account.findOne({ where: { card_number: newAccountData.card_number } }).then(account => {
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
                    console.log('account already exist');
                    console.log(account['dataValues']);
                    resolve(account['dataValues'])
                }
            }, error => {
                reject(error);
            });
        });
    },

    updateAccount: function (newAccountData) {
        return new Promise(function (resolve, reject) {
            models.Account.update({
                owner_name: newAccountData.owner_name,
                cvc: newAccountData.cvc,
                expiry_date: newAccountData.expiry_date,
                card_number: newAccountData.card_number,
                type: newAccountData.type,

            }, { where: { fk_user_id: newAccountData.fk_user_id } }).then(function (result) {
                models.Account.findOne({ where: { fk_user_id: newAccountData.fk_user_id }, attributes: ['owner_name', 'cvc', 'expiry_date', 'card_number', 'type'] }).then(account => {
                    resolve(account);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },
    deleteAccount: function (newAccountData) {
        return new Promise(function (resolve, reject) {
            models.Account.destroy({ where: { fk_user_id: newAccountData.fk_user_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    }

};
Object.assign(AccountRepository, commonRepository);
module.exports = AccountRepository;