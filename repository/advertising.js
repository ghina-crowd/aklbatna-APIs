
var models = require('../models/models.js');
var model_deal = require('../models/deals_model');
var commonRepository = require('./common.js');
const sequelize = require('sequelize');
const Op = sequelize.Op;
var AdvertisingRepository = {
    GetAll: function () {
        return new Promise(function (resolve, reject) {
            console.log('we are in call')
            models.Advertising.belongsTo(model_deal.Deals, { foreignKey: 'deal_id' })
            models.Advertising.findAll({
                [Op.or]: [{
                    start_date: {
                        [Op.between]: [new Date()]
                    }
                }, {
                    end_date: {
                        [Op.between]: [new Date()]
                    }
                }],
                include: [{
                    model: model_deal.Deals
                }]
            }).then(advertising => {
                resolve(advertising);
            }, error => {
                reject(error);
            });
        });

    },

    Get: function (id) {
        return new Promise(function (resolve, reject) {
            models.Advertising.belongsTo(model_deal.Deals, { foreignKey: 'deal_id' })
            models.Advertising.findAll({
                where: { user_id: id },
                include: [{
                    model: model_deal.Deals
                }]
            }).then(advertising => {
                resolve(advertising);
            }, error => {
                reject(error);
            });
        });

    },
    create_advertising: function (newAdvertisingData) {
        return new Promise(function (resolve, reject) {
            models.Advertising.create({
                deal_id: newAdvertisingData.deal_id,
                user_id: newAdvertisingData.user_id,
                type: newAdvertisingData.type,
                image: newAdvertisingData.image,
                status: newAdvertisingData.status,
                start_date: newAdvertisingData.start_date,
                end_date: newAdvertisingData.end_date,
            }).then(category => {
                console.log(category['dataValues']);
                resolve(category);
            }, error => {
                reject(error)
            });
        });
    },


    update_advertising: function (newAdvertisingData) {
        return new Promise(function (resolve, reject) {
            models.Advertising.update({
                deal_id: newAdvertisingData.deal_id,
                user_id: newAdvertisingData.user_id,
                type: newAdvertisingData.type,
                image: newAdvertisingData.image,
                status: newAdvertisingData.status,
                start_date: newAdvertisingData.start_date,
                end_date: newAdvertisingData.end_date,
            }, { where: { add_id: newAdvertisingData.add_id } }).then(function (result) {
                models.Advertising.findOne({ where: { add_id: newAdvertisingData.add_id } }).then(advertising => {
                    resolve(advertising);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });

    },
    delete_advertising: function (add_id) {
        return new Promise(function (resolve, reject) {
            models.Advertising.destroy({ where: { add_id: add_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },
};
Object.assign(AdvertisingRepository, commonRepository);
module.exports = AdvertisingRepository;