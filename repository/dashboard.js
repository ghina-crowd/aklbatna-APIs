var models = require('../models/deals_model.js');
var model_rate = require('../models/rating_model.js');
var model_images = require('../models/image_model.js');
var sub_deals = require('../models/sub_deals_model.js');
var info_deals = require('../models/sub_deals_info');
var condition_deals = require('../models/sub_deals_conditions');
var model_company = require('../models/company_model.js');
var model = require('../models/models.js');
var category_model = require('../models/categories_model.js');
var sub_category_model = require('../models/sub_categories_model');
var commonRepository = require('./common.js');
var lang = require('../app');
var company_model = require('../models/company_model');
const sequelize = require('sequelize');
const Op = sequelize.Op;
var deal_attributes, company_attributes, sub_deals_attributes, info_deals_attributes, conditions_deals_attributes, cat_attributes;

var dealsRepository = {
    Admin: async function () {
        return new Promise(async function (resolve, reject) {

            var response = {};

            await dealsRepository.getDeals().then(deals => {
                response.deals = deals;
            }).catch(error => {
                reject(null)
            });


            await dealsRepository.getCategories().then(categories => {
                response.categories = categories;
            }).catch(error => {
                reject(null)
            });


            await dealsRepository.getSubCategoires().then(subcategories => {
                response.subcategories = subcategories;
            }).catch(error => {
                reject(null)
            });


            await dealsRepository.getPromotions().then(promotions => {
                response.promotions = promotions;
            }).catch(error => {
                reject(null)
            });

            await dealsRepository.getPurchase().then(purcahse => {
                response.purcahse = purcahse;
            }).catch(error => {
                reject(null)
            });

            await dealsRepository.getRequests().then(requests => {
                response.requests = requests;
            }).catch(error => {
                reject(null)
            });

            await dealsRepository.getServicePro().then(servicePro => {
                response.servicePro = servicePro;
            }).catch(error => {
                reject(null)
            });

            await dealsRepository.getSalesRep().then(salesrep => {
                response.salesrep = salesrep;
            }).catch(error => {
                reject(null)
            });

            await dealsRepository.getNormal().then(normal => {
                response.normal = normal;
            }).catch(error => {
                reject(null)
            });

            resolve(response)


        });
    },

    ServicePro: async function (user_id) {
        return new Promise(async function (resolve, reject) {
            var response = {};
            await dealsRepository.getDealsSerivcePro(user_id).then(deals => {
                response.deals = deals;
            }).catch(error => {
                reject(null)
            });


            await dealsRepository.getPromotionsServicePro(user_id).then(promotions => {
                response.promotions = promotions;
            }).catch(error => {
                reject(null)
            });

            await dealsRepository.getPurchaseServicePro(user_id).then(purcahse => {
                response.purcahse = purcahse;
            }).catch(error => {
                reject(null)
            });

            await dealsRepository.getBranchesServicePro(user_id).then(branches => {
                response.branches = branches;
            }).catch(error => {
                reject(null)
            });

    

            resolve(response)


        });
    },

    SalesRep: async function (user_id) {
        return new Promise(async function (resolve, reject) {
            var response = {};

            await dealsRepository.getRequestsSales(user_id).then(requests => {
                response.requests = requests;
            }).catch(error => {
                reject(null)
            });

            await dealsRepository.getActivitiesSales(user_id).then(activities => {
                response.activities = activities;
            }).catch(error => {
                reject(null)
            });
            resolve(response)


        });
    },

    getDeals: async function () {
        return new Promise(async function (resolve, reject) {
            models.Deals.findAll({
                raw: true,
                logging: true,
                attributes: ['active', [sequelize.fn('COUNT', sequelize.col('active')), 'total']],
                group: ['active'],
            }).then(deals => {
                if (deals == null) {
                    resolve(null);
                } else {
                    resolve(deals)
                }
            }, error => {
                reject(error);
            });
        });
    },
    getDealsSerivcePro: async function (user_id) {
        return new Promise(async function (resolve, reject) {
            models.Deals.findAll({
                raw: true,
                where: { user_id: user_id },
                logging: true,
                attributes: ['active', [sequelize.fn('COUNT', sequelize.col('active')), 'total']],
                group: ['active'],
            }).then(deals => {
                if (deals == null) {
                    resolve(null);
                } else {
                    resolve(deals)
                }
            }, error => {
                reject(error);
            });
        });
    },
    getServicePro: async function () {
        return new Promise(async function (resolve, reject) {
            model.User.findAll({
                where: { user_type: 'ServicePro' },
                raw: true,
                logging: true,
                attributes: ['active', [sequelize.fn('COUNT', sequelize.col('active')), 'total']],
                group: ['active'],
            }).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users)
                }
            }, error => {
                reject(error);
            });
        });
    },
    getSalesRep: async function () {
        return new Promise(async function (resolve, reject) {
            model.User.findAll({
                where: { user_type: 'SalesRep' },
                raw: true,
                logging: true,
                attributes: ['active', [sequelize.fn('COUNT', sequelize.col('active')), 'total']],
                group: ['active'],
            }).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users)
                }
            }, error => {
                reject(error);
            });
        });
    },
    getNormal: async function () {
        return new Promise(async function (resolve, reject) {
            model.User.findAll({
                where: { user_type: 'normal' },
                raw: true,
                logging: true,
                attributes: ['active', [sequelize.fn('COUNT', sequelize.col('active')), 'total']],
                group: ['active'],
            }).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users)
                }
            }, error => {
                reject(error);
            });
        });
    },
    getCategories: async function () {
        return new Promise(async function (resolve, reject) {
            category_model.Categories.findAll({
                raw: true,
                logging: true,
                attributes: ['active', [sequelize.fn('COUNT', sequelize.col('active')), 'total']],
                group: ['active'],
            }).then(Categories => {
                if (Categories == null) {
                    resolve(null);
                } else {
                    resolve(Categories)
                }
            }, error => {
                reject(error);
            });
        });
    },
    getSubCategoires: async function () {
        return new Promise(async function (resolve, reject) {
            sub_category_model.SubCategory.findAll({
                raw: true,
                logging: true,
                attributes: ['active', [sequelize.fn('COUNT', sequelize.col('active')), 'total']],
                group: ['active'],
            }).then(Categories => {
                if (Categories == null) {
                    resolve(null);
                } else {
                    resolve(Categories)
                }
            }, error => {
                reject(error);
            });
        });
    },
    getPurchase: async function () {
        return new Promise(async function (resolve, reject) {
            model.Purchase.findAll({
                raw: true,
                logging: true,
                attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'total']],
                group: ['status'],
            }).then(Purchase => {
                if (Purchase == null) {
                    resolve(null);
                } else {
                    resolve(Purchase)
                }
            }, error => {
                reject(error);
            });
        });
    },
    getPurchaseServicePro: async function (user_id) {
        return new Promise(async function (resolve, reject) {
            model.Purchase.belongsTo(models.Deals, { foreignKey: 'deal_id' })
            model.Purchase.findAll({
                raw: true,
                logging: true,
                include: [{ model: models.Deals, where: { user_id: user_id }, attributes: ['active', [sequelize.fn('COUNT', sequelize.col('active')), 'total']], group: ['active'] }],
                attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'total']],
                group: ['status'],
            }).then(Purchase => {
                if (Purchase == null) {
                    resolve(null);
                } else {
                    resolve(Purchase)
                }
            }, error => {
                reject(error);
            });
        });
    },
    getPromotions: async function () {
        return new Promise(async function (resolve, reject) {
            model.Advertising.findAll({
                raw: true,
                logging: true,
                attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'total']],
                group: ['status'],
            }).then(Promotions => {
                if (Promotions == null) {
                    resolve(null);
                } else {
                    resolve(Promotions)
                }
            }, error => {
                reject(error);
            });
        });
    },

    getPromotionsServicePro: async function (user_id) {
        return new Promise(async function (resolve, reject) {
            model.Advertising.findAll({
                raw: true,
                where: { user_id: user_id },
                logging: true,
                attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'total']],
                group: ['status'],
            }).then(Promotions => {
                if (Promotions == null) {
                    resolve(null);
                } else {
                    resolve(Promotions)
                }
            }, error => {
                reject(error);
            });
        });
    },
    getRequests: async function () {
        return new Promise(async function (resolve, reject) {
            model.Requests.findAll({
                raw: true,
                logging: true,
                attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'total']],
                group: ['status'],
            }).then(Promotions => {
                if (Promotions == null) {
                    resolve(null);
                } else {
                    resolve(Promotions)
                }
            }, error => {
                reject(error);
            });
        });
    },
    getRequestsSales: async function (user_id) {
        return new Promise(async function (resolve, reject) {
            model.Requests.findAll({
                raw: true,
                where: { request_to: user_id },
                logging: true,
                attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'total']],
                group: ['status'],
            }).then(Promotions => {
                if (Promotions == null) {
                    resolve(null);
                } else {
                    resolve(Promotions)
                }
            }, error => {
                console.log(error)
                reject(error);
            });
        });
    },

    getActivitiesSales: async function (user_id) {
        return new Promise(async function (resolve, reject) {
            model.Activities.findAll({
                raw: true,
                where: { admin_user_id: user_id },
                logging: true,
                attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'total']],
                group: ['status'],
            }).then(Promotions => {
                if (Promotions == null) {
                    resolve(null);
                } else {
                    resolve(Promotions)
                }
            }, error => {
                console.log(error)
                reject(error);
            });
        });
    },


    getBranchesServicePro: async function (user_id) {
        return new Promise(async function (resolve, reject) {
            company_model.Company_Branches.belongsTo(company_model.Company, { foreignKey: 'company_id' });
            company_model.Company_Branches.findAll({
                raw: true,
                distinct: true,
                attributes: ['active', [sequelize.fn('COUNT', sequelize.col('company_branches.active')), 'total']],
                logging: true,
                group: ['active'],
                include: [{ model: company_model.Company, attributes: ['active', [sequelize.fn('COUNT', sequelize.col('company.active')), 'total']], where: { user_id: user_id }, }],
            }).then(Purchase => {
                if (Purchase == null) {
                    resolve(null);
                } else {
                    resolve(Purchase)
                }
            }, error => {
                console.log(error)
                resolve(null);
            });
        });
    },
    getCompaniesServicePro: async function (user_id) {
        return new Promise(async function (resolve, reject) {
            company_model.Company.findAll({
                raw: true,
                distinct: true,
                where: { user_id: user_id },
                attributes: ['active', [sequelize.fn('COUNT', sequelize.col('active')), 'total']],
                logging: true,
                group: ['active'],
            }).then(Purchase => {
                if (Purchase == null) {
                    resolve(null);
                } else {
                    resolve(Purchase)
                }
            }, error => {
                console.log(error)
                resolve(null);
            });
        });
    }
}
Object.assign(dealsRepository, commonRepository);
module.exports = dealsRepository;