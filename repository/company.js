var companymodel = require('../models/company_model');
var dealmodel = require('../models/deals_model');
var commonRepository = require('./common.js');
var lang = require('../app');
const sequelize = require('sequelize');


const Op = sequelize.Op;
var deal_attributes, company_attributes, sub_deals_attributes, cat_attributes;
var CompanyRepository = {

    filter_companies: function (latitude, longitude, location_name, page) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;
        return new Promise(function (resolve, reject) {
            if (lang.acceptedLanguage == 'en') {
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_en', 'deal_title'], 'latitude', 'longitude', 'location_address', 'is_monthly', 'short_detail', ['details_en', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
                company_attributes = ['company_id', ['company_name_en', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_en', 'description'], 'website_link'];
            } else {
                deal_attributes = ['deal_id', 'shop_category_id', ['deal_title_ar', 'deal_title'], 'latitude', 'longitude', 'location_address', 'is_monthly', 'short_detail', ['details_ar', 'details'], 'pre_price', 'new_price', 'start_time', 'end_time', 'main_image', 'final_rate', 'active'];
                company_attributes = ['company_id', ['company_name_ar', 'company_name'], 'latitude', 'longitude', 'location_name', ['description_ar', 'description'], 'website_link'];
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
            companymodel.Company.hasMany(dealmodel.Deals, { foreignKey: 'company_id' })
            companymodel.Company.findAll({
                attributes: company_attributes,
                // offset: offset,
                where: data,
                include: [{
                    model: dealmodel.Deals,
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