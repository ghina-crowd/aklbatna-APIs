var PurchaseRepository = require('../repository/purcahse');
module.exports = {
    GetAllPurchase: function (id) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.GetAll(id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllPurchaseCompany: function (company_id) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.GetAllCompany(company_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllUased: function (id) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.GetAllUsed(id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllUnused: function (id) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.GetAllUnused(id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    CreatePurchase: function (newPurchaseData) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.CreatePurchase(newPurchaseData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    DeletePurchase: function (newPurchaseData) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.DeletePurchase(newPurchaseData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
};