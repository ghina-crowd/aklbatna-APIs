var AccountRepository = require('../repository/accounts.js');
var fields = require('../constant/field.js');
var models = require('../models/models.js');
module.exports = {
    GetAccount: function (user_admin_id) {
        return new Promise(function (resolve, reject) {
            AccountRepository.getAccount(user_admin_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    Create: function (newAccountData) {
        return new Promise(function (resolve, reject) {
            AccountRepository.CreateAccount(newAccountData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    Delete: function (AccountData) {
        return new Promise(function (resolve, reject) {
            AccountRepository.deleteAccount(AccountData).then(deleteresponse => {
                resolve(deleteresponse);
            }, error => {
                reject(error);
            });
        });
    },
    Update: function (newAccountData) {
        return new Promise(function (resolve, reject) {
            AccountRepository.updateAccount(newAccountData).then(account => {
                resolve(account);
            }, function (error) {
                reject(error);
            });

        }, error => {
            reject(error);
        });

    }
};