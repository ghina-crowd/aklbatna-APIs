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
    getOrders: function (status, page) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.getOrders(status, page).then(user => {
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
    GetAllByDeal: function (deal_id) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.GetAllByDeal(deal_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllByCompany: function (company_id) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.GetAllByCompany(company_id).then(user => {
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
    CreatePurchaseMany: function (newPurchaseData, id) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.CreatePurchaseMany(newPurchaseData, id).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    UpdateOrder: function (newPurchaseData, id) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.UpdateOrder(newPurchaseData, id).then(function (result) {
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

    DeleteOrder: function (newPurchaseData) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.DeleteOrder(newPurchaseData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },

    UpdatePurchase: function (newPurchaseData) {
        return new Promise(function (resolve, reject) {
            PurchaseRepository.UpdatePurchase(newPurchaseData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
};