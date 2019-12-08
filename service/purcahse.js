var PurchaseRepository = require('../repository/purcahse');
module.exports = {
    GetAllPurchase: function () {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.GetAll().then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllUased: function () {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.GetAllUsed().then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllUnused: function () {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.GetAllUnused().then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    CreatePurchase: function (newAccountData) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.CreateAccount(newAccountData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
};