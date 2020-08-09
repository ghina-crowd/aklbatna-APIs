var couponsRepository = require('../repository/Coupons');


module.exports = {
    Verify: function (coupon) {
        return new Promise(function (resolve, reject) {
            couponsRepository.Verify(coupon).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getAllAdmin: function () {
        return new Promise(function (resolve, reject) {
            couponsRepository.getAllcouponsAdmin().then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    create: function (newcouponData) {
        return new Promise(function (resolve, reject) {
            couponsRepository.createcoupons(newcouponData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    update: function (credentials) {
        return new Promise(function (resolve, reject) {
            couponsRepository.update(credentials).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    Delete: function (coupon_id) {
        return new Promise(function (resolve, reject) {
            couponsRepository.deletecoupons(coupon_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    }
};