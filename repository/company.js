var company_model = require('../models/company_model');
var deal_model = require('../models/deals_model');
var commonRepository = require('./common.js');
var lang = require('../app');
const sequelize = require('sequelize');


const Op = sequelize.Op;
var deal_attributes, company_attributes
var CompanyRepository = {
    filter_companies: function (latitude, longitude, location_name, page) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;
        return new Promise(function (resolve, reject) {
            if (lang.acceptedLanguage == 'en') {
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
                company_attributes = ['company_id', ['company_name_en', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link', 'icon'];
            } else {
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
                company_attributes = ['company_id', ['company_name_ar', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_ar', 'description'], 'website_link', 'icon'];
            }

            var data = {};
            if (location_name) {
                if (lang.acceptedLanguage == 'en') {
                    data.location_name = {
                        [Op.like]: '%' + location_name + '%'
                    }
                } else {
                    data.location_name = {
                        [Op.like]: '%' + location_name + '%'
                    }
                }
            }
            company_model.Company.hasMany(deal_model.Deals, { foreignKey: 'company_id' })
            company_model.Company.findAll({
                attributes: company_attributes,
                // offset: offset,
                where: data,
                include: [{
                    model: deal_model.Deals,
                    attributes: deal_attributes,
                }]
            }).then(companies => {

                var filtercompanies = [];
                companies.forEach(item => {
                    var distance = calcDistance(item.latitude, item.longitude, latitude, longitude);
                    if (distance <= 10) {
                        item["dataValues"].distance = distance;
                        filtercompanies.push(item);
                    }
                });
                filtercompanies.sort((a, b) => parseFloat(a["dataValues"].distance) - parseFloat(b["dataValues"].distance));
                resolve(filtercompanies);
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
                company_attributes = ['company_id', ['company_name_en', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link', 'icon'];
            } else {
                company_attributes = ['company_id', ['company_name_en', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link', 'icon'];
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

            company_model.Company.findAll({
                limit: pageSize, offset: offset, attributes: company_attributes
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
                city_location: newCompanyData.city_location,
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
            }).then(company => {
                resolve(company);
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
                website_link: newCompanyData.website_link,
                icon: newCompanyData.icon,

                trade_name: newCompanyData.trade_name,
                licence_number: newCompanyData.licence_number,
                expiry_date: newCompanyData.expiry_date,
                tax_number: newCompanyData.tax_number,
                city_location: newCompanyData.city_location,
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
                
            }, { where: { company_id: newCompanyData.company_id } }).then(function (result) {
                company_model.Company.findOne({ where: { company_id: newCompanyData.company_id } }).then(deal => {
                    resolve(deal);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },

    delete_company: function (company_id) {
        return new Promise(function (resolve, reject) {
            company_model.Company.destroy({ where: { company_id: company_id } }).then(deleted => {
                resolve(deleted);
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