var company_model = require('../models/company_model');
var deal_model = require('../models/deals_model');
var sub_deal_model = require('../models/sub_deals_model');
var models = require('../models/models');
var commonRepository = require('./common.js');
var lang = require('../app');
const sequelize = require('sequelize');


const Op = sequelize.Op;
var deal_attributes, company_attributes, company_branches_attributes
var CompanyRepository = {
    filter_companies: function (page, title) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;
        return new Promise(function (resolve, reject) {
            // if (lang.acceptedLanguage == 'en') {
            //     deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'location_location_name', 'is_monthly', , ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            //     company_attributes = ['company_id', ['company_name_en', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link', 'icon'];
            //     company_branches_attributes = ['branch_id', ['name_en', 'name'], 'company_id', 'status', 'location_name', 'latitude', 'longitude'];
            // } else {
            //     deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'location_location_name', 'is_monthly', , ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
            //     company_attributes = ['company_id', ['company_name_ar', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_ar', 'description'], 'website_link', 'icon'];
            //     company_branches_attributes = ['branch_id', ['name_ar', 'name'], 'company_id', 'status', 'location_name', 'latitude', 'longitude'];
            // }

            var data = {};
            if (title && title != 'all') {
                if (lang.acceptedLanguage == 'en') {
                    data.company_name_en = {
                        [Op.like]: '%' + title + '%'
                    }
                } else {
                    data.company_name_ar = {
                        [Op.like]: '%' + title + '%'
                    }
                }
            }
            company_model.Company.hasMany(company_model.Company_Branches, { foreignKey: 'company_id' });
            company_model.Company.belongsTo(models.User, { foreignKey: 'user_id' });
            company_model.Company.findAndCountAll({
                // attributes: company_attributes,
                offset: offset,
                where: data,
                include: [{
                    model: company_model.Company_Branches,
                }, {
                    model: models.User,
                }]
            }).then(companies => {
                var dealsTemp = companies.rows;
                companies.companies = dealsTemp;
                delete companies.rows;
                resolve(companies);

                // var filtercompanies = [];
                // companies.forEach(item => {
                //     var distance = calcDistance(item.latitude, item.longitude, latitude, longitude);
                //     if (distance <= 10) {
                //         item["dataValues"].distance = distance;
                //         filtercompanies.push(item);
                //     }
                // });
                // filtercompanies.sort((a, b) => parseFloat(a["dataValues"].distance) - parseFloat(b["dataValues"].distance));
                resolve(companies);
            }, error => {
                reject(error);
            });
        }
        );
    },
    get_companies: function (page, keyword) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;
        return new Promise(function (resolve, reject) {

            if (lang.acceptedLanguage == 'en') {
                company_attributes = ['company_id', ['company_name_en', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link', 'icon','target'];
                company_branches_attributes = ['branch_id', ['name_en', 'name'], 'company_id', 'status', 'location_name', 'latitude', 'longitude'];
            } else {
                company_attributes = ['company_id', ['company_name_ar', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link', 'icon','target'];
                company_branches_attributes = ['branch_id', ['name_ar', 'name'], 'company_id', 'status', 'location_name', 'latitude', 'longitude'];
            }
            var data = {}
            if (keyword) {
                if (lang.acceptedLanguage == 'en') {
                    data.deal_title_en = {
                        [Op.like]: '%' + keyword + '%'
                    }
                } else {
                    data.deal_title_ar = {
                        [Op.like]: '%' + keyword + '%'
                    }
                }
            }
            company_model.Company.hasMany(company_model.Company_Branches, { foreignKey: 'company_id' });
            company_model.Company.findOne({
                limit: pageSize, offset: offset, attributes: company_attributes,
                include: [{
                    model: company_model.Company_Branches,
                    attributes: company_branches_attributes
                }]
            }).then(companies => {
                if (companies == null) {
                    resolve([]);
                } else {
                    resolve(companies);
                }
            }, error => {
                reject(error);
            });
        }
        );
    },
    get_companiesAdmin: function (page) {

        if (page) {
            var pageSize = 12; // page start from 0
            const offset = page * pageSize;
            return new Promise(function (resolve, reject) {

                company_model.Company.hasMany(company_model.Company_Branches, { foreignKey: 'company_id' });
                company_model.Company.belongsTo(models.User, { foreignKey: 'user_id' });
                company_model.Company.findAndCountAll({
                    limit: pageSize, offset: offset,
                    include: [{
                        model: company_model.Company_Branches,
                    }, {
                        model: models.User,
                    }]
                }).then(companies => {
                    if (companies == null) {
                        resolve([]);
                    } else {

                        var companiesTemp = companies.rows;
                        companies.companies = companiesTemp;
                        delete companies.rows;

                        resolve(companies);
                    }
                }, error => {
                    reject(error);
                });
            }
            );
        } else {

            return new Promise(function (resolve, reject) {
                company_model.Company.hasMany(company_model.Company_Branches, { foreignKey: 'company_id' });

                company_model.Company.hasMany(deal_model.Deals, { foreignKey: 'company_id' });
                company_model.Company.hasMany(models.Purchase, { foreignKey: 'company_id' });
                models.Purchase.belongsTo(sub_deal_model.SubDeals, { foreignKey: 'sub_deal_id' });
                company_model.Company.belongsTo(models.User, { foreignKey: 'user_id' });

                company_model.Company.findAll({
                    include: [{
                        model: company_model.Company_Branches
                    }, {
                        model: models.User,
                    }, {
                        model: models.Purchase, include: [{
                            model: sub_deal_model.SubDeals
                        }]
                    }]
                }).then(companies => {
                    if (companies == null) {
                        resolve([]);
                    } else {
                        companies.forEach(company => {
                            company['dataValues'].profit = 0;
                            company['dataValues'].purchases.forEach(purchases => {
                                if (purchases['dataValues'].sub_deal) {
                                    console.log(purchases['dataValues'].sub_deal.voucher)
                                    company['dataValues'].profit = company['dataValues'].profit + (purchases['dataValues'].sub_deal.voucher * purchases['dataValues'].quantity)
                                }
                            });
                        });

                        companies.forEach(company => {
                            delete company['dataValues'].purchases;
                        });
                        resolve(companies);
                    }
                }, error => {
                    reject(error);
                });
            }
            );
        }

    },

    get_company: function (id) {
        return new Promise(function (resolve, reject) {
            console.log(id);

            // if (lang.acceptedLanguage == 'en') {
            //     company_attributes = ['company_id', ['company_name_en', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link', 'icon'];
            //     company_branches_attributes = ['branch_id', ['name_en', 'name'], 'company_id', 'status', 'location_name', 'latitude', 'longitude'];
            // } else {
            //     company_attributes = ['company_id', ['company_name_ar', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link', 'icon'];
            //     company_branches_attributes = ['branch_id', ['name_ar', 'name'], 'company_id', 'status', 'location_name', 'latitude', 'longitude'];
            // }

            company_model.Company.hasMany(company_model.Company_Branches, { foreignKey: 'company_id' });
            company_model.Company.findOne({
                where: {
                    company_id: id
                },
                include: [{
                    model: company_model.Company_Branches,
                }]
            }).then(companies => {
                if (companies == null) {
                    resolve({});
                } else {
                    resolve(companies);
                }
            }, error => {
                reject(error);
            });
        }
        );
    },
    get_branch: function (id) {
        return new Promise(function (resolve, reject) {
            company_model.Company_Branches.findOne({
                where: {
                    branch_id: id
                }
            }).then(branch => {
                if (branch == null) {
                    resolve([]);
                } else {
                    resolve(branch);
                }
            }, error => {
                reject(error);
            });
        }
        );
    },
    create_company_branch: function (CompanyBranchData, company_id) {
        return new Promise(function (resolve, reject) {
            company_model.Company_Branches.findOne({ attributes: ['branch_id'], where: { company_id: company_id } }).then(branch_id => {
                if (branch_id == null) {
                    company_model.Company_Branches.create({
                        company_id: company_id,
                        status: 1,
                        location_name: CompanyBranchData.location_name,
                        latitude: CompanyBranchData.latitude,
                        longitude: CompanyBranchData.longitude,
                        name_ar: CompanyBranchData.name_ar,
                        name_en: CompanyBranchData.name_en,
                        city_id: CompanyBranchData.city_id
                    }).then(branch => {
                        resolve(branch);
                    }, error => {
                        reject(error)
                    });
                } else {
                    company_model.Company_Branches.create({
                        company_id: company_id,
                        status: 0,
                        location_name: CompanyBranchData.location_name,
                        latitude: CompanyBranchData.latitude,
                        longitude: CompanyBranchData.longitude,
                        name_ar: CompanyBranchData.name_ar,
                        name_en: CompanyBranchData.name_en,
                        city_id: CompanyBranchData.city_id
                    }).then(branch => {
                        resolve(branch);
                    }, error => {
                        reject(error)
                    });
                }
            }, error => {
                reject(error);
            });
        });
    },
    create_company: function (newCompanyData) {

        return new Promise(function (resolve, reject) {
            company_model.Company.create({
                user_id: newCompanyData.user_id,
                company_name_en: newCompanyData.company_name_en,
                company_name_ar: newCompanyData.company_name_ar,
                description_en: newCompanyData.description_en,
                description_ar: newCompanyData.description_ar,
                latitude: newCompanyData.latitude,
                longitude: newCompanyData.longitude,
                location_name: newCompanyData.location_name,
                website_link: newCompanyData.website_link,
                icon: newCompanyData.icon,

                trade_name: newCompanyData.trade_name,
                licence_number: newCompanyData.licence_number,
                expiry_date: newCompanyData.expiry_date,
                tax_number: newCompanyData.tax_number,
                facebook_page: newCompanyData.facebook_page,
                instagram_page: newCompanyData.instagram_page,
                number_of_locations: newCompanyData.number_of_locations,
                nature_of_business: newCompanyData.nature_of_business,

                url_signed_company_form: newCompanyData.url_signed_company_form,
                url_trade_license: newCompanyData.url_trade_license,
                url_service_provider_id: newCompanyData.url_service_provider_id,
                url_owner_photo_with_id: newCompanyData.url_owner_photo_with_id,
                landline_number: newCompanyData.landline_number,
                company_role: newCompanyData.company_role,
                cost_type: newCompanyData.cost_type,
                target: newCompanyData.target,

            }).then(company => {

                var branch = {};
                branch['location_name'] = newCompanyData.location_name;
                branch['latitude'] = newCompanyData.latitude;
                branch['longitude'] = newCompanyData.longitude;
                branch['name_ar'] = newCompanyData.company_name_ar;
                branch['name_en'] = newCompanyData.company_name_en;
                branch['city_id'] = newCompanyData.city_id;
                CompanyRepository.create_company_main_branch(branch, company.company_id).then(companyBranch => {
                    company['dataValues'].branches = [];
                    company['dataValues'].branches.push(companyBranch);
                    resolve(company);
                }).catch(error => {
                    reject(error)
                })
            }, error => {
                console.log('error while creating company or branch');
                console.log(error);
                reject(error)
            });
        });
    },
    update_company_main_branch: function (CompanyBranchData, company_id) {
        return new Promise(function (resolve, reject) {
            company_model.Company_Branches.findOne({ attributes: ['branch_id'], where: { status: 1, company_id: company_id } }).then(branch_id => {
                console.log(branch_id);
                if (branch_id) {
                    company_model.Company_Branches.update({
                        company_id: company_id,
                        status: 1,
                        active: CompanyBranchData.active,
                        location_name: CompanyBranchData.location_name,
                        latitude: CompanyBranchData.latitude,
                        longitude: CompanyBranchData.longitude,
                        name_ar: CompanyBranchData.name_ar,
                        name_en: CompanyBranchData.name_en,
                        city_id: CompanyBranchData.city_id,
                    }, { where: { branch_id: branch_id['dataValues'].branch_id } }).then(branch => {
                        company_model.Company_Branches.findOne({ where: { company_id: company_id, status: 1 } }).then(branches => {
                            resolve(branches);
                        }, error => {
                            reject(error);
                        });
                    }, error => {
                        reject(error)
                    });
                } else {
                    reject(null)
                }


            }, error => {
                reject(error);
            });
        });
    },


    create_company_main_branch: function (CompanyBranchData, company_id) {
        return new Promise(function (resolve, reject) {
            company_model.Company_Branches.findOne({ where: { status: 1, company_id: company_id } }).then(branch => {
                if (branch) {
                    resolve(branch);
                } else {
                    company_model.Company_Branches.create({
                        company_id: company_id,
                        status: 1,
                        active: 1,
                        location_name: CompanyBranchData.location_name,
                        latitude: CompanyBranchData.latitude,
                        longitude: CompanyBranchData.longitude,
                        name_ar: CompanyBranchData.name_ar,
                        name_en: CompanyBranchData.name_en,
                        city_id: CompanyBranchData.city_id
                    }).then(response => {
                        if (response) {
                            company_model.Company_Branches.findOne({ where: { company_id: company_id, status: 1 } }).then(branch => {
                                resolve(branch);
                            }, error => {
                                reject(error);
                            });
                        } else {
                            reject(null);
                        }

                    }, error => {
                        reject(error)
                    });
                }


            }, error => {
                reject(error);
            });
        });
    },



    create_company_branch: function (CompanyBranchData) {
        return new Promise(function (resolve, reject) {
            company_model.Company_Branches.create({
                company_id: CompanyBranchData.company_id,
                status: 0,
                active: 1,
                location_name: CompanyBranchData.location_name,
                latitude: CompanyBranchData.latitude,
                longitude: CompanyBranchData.longitude,
                name_ar: CompanyBranchData.name_ar,
                name_en: CompanyBranchData.name_en,
                city_id: CompanyBranchData.city_id
            }).then(branch => {
                resolve(branch);
            }, error => {
                reject(error)
            });
        });
    },

    delete_company_branch: function (branch_id) {
        return new Promise(function (resolve, reject) {
            company_model.Company_Branches.destroy({ where: { branch_id: branch_id, status: 0 } }).then(deleted_company => {
                deal_model.Deals.update({ active: 0 }, { where: { branch_id: branch_id } }).then(updated => {
                    resolve(deleted_company);
                }, error => {
                    reject(error);
                });
            }, error => {
                reject(error);
            });
        });
    },

    update_company_branch: function (CompanyBranchData) {
        return new Promise(function (resolve, reject) {
            company_model.Company_Branches.update({
                location_name: CompanyBranchData.location_name,
                latitude: CompanyBranchData.latitude,
                active: CompanyBranchData.active,
                longitude: CompanyBranchData.longitude,
                name_ar: CompanyBranchData.name_ar,
                name_en: CompanyBranchData.name_en,
                city_id: CompanyBranchData.city_id
            }, { where: { branch_id: CompanyBranchData.branch_id } }).then(response => {
                company_model.Company_Branches.findOne({ where: { branch_id: CompanyBranchData.branch_id } }).then(branch => {
                    resolve(branch);
                }, error => {
                    reject(error);
                });
            }, error => {
                reject(error)
            });
        });
    },


    update_company: function (newCompanyData) {
        return new Promise(function (resolve, reject) {
            company_model.Company.update({
                user_id: newCompanyData.user_id,
                company_name_en: newCompanyData.company_name_en,
                company_name_ar: newCompanyData.company_name_ar,
                description_en: newCompanyData.description_en,
                description_ar: newCompanyData.description_ar,
                latitude: newCompanyData.latitude,
                longitude: newCompanyData.longitude,
                location_name: newCompanyData.location_name,
                location_name: newCompanyData.location_name,
                website_link: newCompanyData.website_link,
                icon: newCompanyData.icon,
                trade_name: newCompanyData.trade_name,
                licence_number: newCompanyData.licence_number,
                expiry_date: newCompanyData.expiry_date,
                tax_number: newCompanyData.tax_number,
                active: newCompanyData.active,
                facebook_page: newCompanyData.facebook_page,
                instagram_page: newCompanyData.instagram_page,
                number_of_locations: newCompanyData.number_of_locations,
                nature_of_business: newCompanyData.nature_of_business,
                url_signed_company_form: newCompanyData.url_signed_company_form,
                url_trade_license: newCompanyData.url_trade_license,
                url_service_provider_id: newCompanyData.url_service_provider_id,
                url_owner_photo_with_id: newCompanyData.url_owner_photo_with_id,
                landline_number: newCompanyData.landline_number,
                company_role: newCompanyData.company_role,
                cost_type: newCompanyData.cost_type,
                target: newCompanyData.target,

            }, { where: { company_id: newCompanyData.company_id } }).then(function (result) {
                company_model.Company.findOne({ where: { company_id: newCompanyData.company_id } }).then(company => {

                    console.log('branch');

                    var branch = {};
                    branch['location_name'] = newCompanyData.location_name;
                    branch['latitude'] = newCompanyData.latitude;
                    branch['longitude'] = newCompanyData.longitude;
                    branch['name_ar'] = newCompanyData.company_name_ar;
                    branch['name_en'] = newCompanyData.company_name_en;
                    branch['active'] = newCompanyData.active;
                    CompanyRepository.update_company_main_branch(branch, newCompanyData.company_id).then(companyBranch => {
                        company['dataValues'].branches = [];
                        company['dataValues'].branches.push(companyBranch);
                        resolve(company);

                    }).catch(error => {
                        // reject(error)
                    })
                }, error => {
                    // reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },

    delete_company: function (company_id) {
        return new Promise(function (resolve, reject) {
            company_model.Company.destroy({ where: { company_id: company_id } }).then(deleted => {
                company_model.Company_Branches.destroy({ where: { company_id: company_id } }).then(deleted => {
                    deal_model.Deals.destroy({ where: { company_id: company_id } }).then(deleted => {
                        resolve(deleted);
                    }, error => {
                        reject(error);
                    });
                }, error => {
                    reject(error);
                });
            }, error => {
                reject(error);
            });
        });
    },
};

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}
Object.assign(CompanyRepository, commonRepository);
module.exports = CompanyRepository;