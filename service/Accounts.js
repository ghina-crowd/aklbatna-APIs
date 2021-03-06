var AccountRepository = require('../repository/Accounts.js');
var fields = require('../constant/field.js');
var models = require('../models/models.js');


module.exports = {
    GetAccount: function (user_id) {
        return new Promise(function (resolve, reject) {
            AccountRepository.getAccount(user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    Create: function (newAccountData) {
        return new Promise(function (resolve, reject) {
            AccountRepository.createAccount(newAccountData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    Check: function (newAccountData) {
        return new Promise(function (resolve, reject) {
            AccountRepository.checkAccount(newAccountData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    Delete: function (account_id) {
        return new Promise(function (resolve, reject) {
            AccountRepository.deleteAccount(account_id).then(delete_response => {
                resolve(delete_response);
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