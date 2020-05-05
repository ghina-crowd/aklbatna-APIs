var OrderRepository = require('../repository/Order');
module.exports = {
    GetAllOrder: function (id, page, sorttype) {
        return new Promise(function (resolve, reject) {
            OrderRepository.GetAll(id, page, sorttype).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    GetKitchenOrders: function (filters) {
        return new Promise(function (resolve, reject) {
            OrderRepository.GetKitchenOrders(filters).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    GetAdminOrders: function (filters) {
        return new Promise(function (resolve, reject) {
            OrderRepository.GetAdminOrders(filters).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },

    Get: function (id) {
        return new Promise(function (resolve, reject) {
            OrderRepository.Get(id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    UpdateOrder: function (newOrderData) {
        return new Promise(function (resolve, reject) {
            OrderRepository.UpdateOrderStatus(newOrderData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    CreateOrder: function (newOrderData) {
        return new Promise(function (resolve, reject) {
            OrderRepository.CreateOrder(newOrderData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    DeleteOrder: function (newOrderData) {
        return new Promise(function (resolve, reject) {
            OrderRepository.DeleteOrder(newOrderData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },

    leaveReview: function (body) {
        return new Promise(function (resolve, reject) {
            OrderRepository.leaveReview(body).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
};