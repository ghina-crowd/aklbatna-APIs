var models = require('../models/models');
var models = require('../models/models');
var commonRepository = require('./common.js');
const sequelize = require('sequelize');

var CompanyRepository = {
    get: function () {
        return new Promise(function (resolve, reject) {
            models.Incentives.findAll().then(incentives => {
                if (incentives == null) {
                    resolve([]);
                } else {
                    resolve(incentives);
                }
            }, error => {
                reject(error);
            });
        }
        );
    },
    get_by: function (company_id) {
        return new Promise(function (resolve, reject) {
            models.Incentives.findOne({ where: { company_id: company_id } }).then(incentives => {
                if (incentives == null) {
                    resolve([]);
                } else {
                    resolve(incentives);
                }
            }, error => {
                reject(error);
            });
        }
        );
    },





    create_incentives: async function (newIncentivesData) {
        return new Promise(async function (resolve, reject) {
            models.Incentives.create({
                company_id: newIncentivesData.company_id,
                reach: newIncentivesData.reach,
                rate_count: newIncentivesData.rate_count,
                complains: newIncentivesData.complains,
                claim: 0,
                fake_deals: 0,
                unjustified: 0,
            }).then(incentives => {
                resolve(incentives);
            }, error => {
                console.log(error);
                reject(error)
            });
        });
    },

    update_incentives: function (newIncentivesData) {
        return new Promise(function (resolve, reject) {
            models.Incentives.update({
                claim: newIncentivesData.claim,
                fake_deals: newIncentivesData.fake_deals,
                unjustified: newIncentivesData.unjustified,
            }, { where: { company_id: newIncentivesData.company_id } }).then(updated => {
                resolve(updated);
            }, error => {
                reject(error);
            });
        });
    }
};

Object.assign(CompanyRepository, commonRepository);
module.exports = CompanyRepository;