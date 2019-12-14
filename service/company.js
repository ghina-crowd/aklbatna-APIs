var CompanyRepository = require('../repository/company');
module.exports = {
    filter_companies: function (latitude, longitude, location_name, page) {
        return new Promise(function (resolve, reject) {
            CompanyRepository.filter_companies(latitude, longitude, location_name, page).then(companies => {
                resolve(companies);
            }, error => {
                reject(error);
            });
        });
    },


    get_companies: function (page, keyword) {
        return new Promise(function (resolve, reject) {
            CompanyRepository.get_companies(page, keyword).then(companies => {
                resolve(companies);
            }, error => {
                reject(error);
            });
        });
    },
    update_company: function (credentials) {
        return new Promise(function (resolve, reject) {
            CompanyRepository.update_company(credentials).then(company => {
                resolve(company);
            }, error => {
                reject(error);
            });
        });
    },
    delete_company: function (company_id) {
        return new Promise(function (resolve, reject) {
            CompanyRepository.delete_company(company_id).then(response => {
                resolve(response);
            }, error => {
                reject(error);
            });
        });
    },
    create_company: function (credentials) {
        return new Promise(function (resolve, reject) {
            CompanyRepository.create_company(credentials).then(company => {
                resolve(company);
            }, error => {
                reject(error);
            });
        });
    },

};