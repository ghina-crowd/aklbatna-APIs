var models = require('../models/models.js');
var commonRepository = require('./common.js');
const sequelize = require('sequelize');
var moment = require('moment');

const Op = sequelize.Op;
var couponsRepository = {

    Verify: function (coupon) {
        return new Promise(function (resolve, reject) {


            var data = {};
            data.active = 1;
            data.code = coupon;
            data.start_date = {
                [Op.lt]: new Date(),
            }

            data.end_date = {
                [Op.gt]: new Date()
            }
            data.max_limit = {
                [Op.gt]: 0
            }

            console.log(data);
            models.Coupons.findOne({ where: data }).then((coupons => {
                if (coupons == null) {
                    resolve(null);
                } else {
                    resolve(coupons);
                }
            }), error => {
                reject(error);
            })
        });
    },
    getAllcouponsAdmin: function () {
        return new Promise(function (resolve, reject) {
            models.Coupons.findAll({ order: [['coupon_id', 'ASC']], }).then((coupons => {
                if (coupons == null) {
                    resolve(null);
                } else {
                    resolve(coupons);
                }
            }), error => {
                reject(error);
            })
        });
    },

    update: function (newcouponsData) {
        return new Promise(function (resolve, reject) {
            models.Coupons.update({
                coupon_id: newcouponsData.coupon_id,
                code: newcouponsData.code,
                start_date: moment(new Date(newcouponsData.start_date)).format('YYYY-MM-DD'),
                end_date: moment(new Date(newcouponsData.end_date)).format('YYYY-MM-DD'),
                active: newcouponsData.active,
                max_limit: newcouponsData.max_limit,
                value: newcouponsData.value,
            }, { where: { coupon_id: newcouponsData.coupon_id } }).then(coupons => {
                models.Coupons.findOne({ where: { coupon_id: newcouponsData.coupon_id } }).then((coupons => {
                    if (coupons == null) {
                        resolve({});
                    } else {
                        resolve(coupons);
                    }
                }), error => {
                    reject(error);
                })
            }, error => {
                reject(error)
            });
        });
    },



    updatemax: function (coupon) {
        if (!coupon) {
            return;
        }
        return new Promise(function (resolve, reject) {
            couponsRepository.Verify(coupon).then((data) => {
                var max_limit = data.dataValues.max_limit;
                max_limit = max_limit - 1;

                var used_count = data.dataValues.used_count;
                used_count = used_count + 1;
                models.Coupons.update({
                    coupon_id: data.dataValues.coupon_id,
                    max_limit: max_limit,
                    used_count: used_count,
                }, { where: { coupon_id: data.dataValues.coupon_id } }).then(coupons => {
                }, error => {
                    reject(error)
                });
            })
        });
    },


    createcoupons: function (newcouponsData) {


        return new Promise(function (resolve, reject) {
            models.Coupons.create({
                code: newcouponsData.code,
                start_date: moment(new Date(newcouponsData.start_date)).format('YYYY-MM-DD'),
                end_date: moment(new Date(newcouponsData.end_date)).format('YYYY-MM-DD'),
                active: newcouponsData.active,
                max_limit: newcouponsData.max_limit,
                value: newcouponsData.value,
            }).then(contact => {
                resolve(contact);
            }, error => {
                reject(error)
            });
        });
    },
    deletecoupons: function (coupon_id) {
        return new Promise(function (resolve, reject) {
            models.Coupons.destroy({ where: { coupon_id: coupon_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    }

};
Object.assign(couponsRepository, commonRepository);
module.exports = couponsRepository;