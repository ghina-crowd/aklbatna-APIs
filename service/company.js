var CompanyRepository = require('../repository/company');
var IncentivesServices = require('../service/incentives');
module.exports = {
    filter_companies: function (page, title) {
        return new Promise(function (resolve, reject) {
            CompanyRepository.filter_companies(page, title).then(companies => {
                resolve(companies);
            }, error => {
                reject(error);
            });
        });
    },


    get_companiesAdmin: function (page) {
        return new Promise(function (resolve, reject) {
            CompanyRepository.get_companiesAdmin(page).then(companies => {
                resolve(companies);
            }, error => {
                reject(error);
            });
        });
    },
    get_company: async function (company_id) {
        return new Promise(async function (resolve, reject) {
            CompanyRepository.get_company(company_id).then(async companies => {
                resolve(companies);
            }, error => {
                reject(error);
            });
        });
    },
    get_branch: function (branch_id) {
        return new Promise(function (resolve, reject) {
            CompanyRepository.get_branch(branch_id).then(branch => {
                resolve(branch);
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
    delete_company_branch: function (branch_id) {
        return new Promise(function (resolve, reject) {
            CompanyRepository.delete_company_branch(branch_id).then(response => {
                resolve(response);
            }, error => {
                reject(error);
            });
        });
    },
    create_company: async function (newCompanyData) {
        return new Promise(async function (resolve, reject) {
            // this is due to while register servicePro we are getting some details but 
            // in database these are mandatory so we are init these as default values.

            if (!newCompanyData.company_name_en) {
                newCompanyData.company_name_en = '';
            }
            if (!newCompanyData.company_name_ar) {
                newCompanyData.company_name_ar = '';
            }
            if (!newCompanyData.description_en) {
                newCompanyData.description_en = '';
            }
            if (!newCompanyData.description_ar) {
                newCompanyData.description_ar = '';
            }
            if (!newCompanyData.latitude) {
                newCompanyData.latitude = 25;
            }
            if (!newCompanyData.longitude) {
                newCompanyData.longitude = 55;
            }

            if (!newCompanyData.location_name) {
                newCompanyData.location_name = '';
            }

            if (!newCompanyData.website_link) {
                newCompanyData.website_link = '';
            }

            if (!newCompanyData.address) {
                newCompanyData.address = '';
            }

            if (!newCompanyData.icon) {
                newCompanyData.icon = '';
            }
            if (!newCompanyData.city_id) {
                newCompanyData.city_id = '0';
            }
            if (!newCompanyData.cost_type) {
                newCompanyData.cost_type = '0';
            }
            CompanyRepository.create_company(newCompanyData).then(async company => {
                console.log(company);
                await IncentivesServices.create_incentives(company);
                resolve(company);
            }, error => {
                reject(error);
            });
        });
    },
    create_company_branch: function (credentials) {
        return new Promise(function (resolve, reject) {
            CompanyRepository.create_company_branch(credentials).then(company => {
                resolve(company);
            }, error => {
                reject(error);
            });
        });
    },
    update_company_branch: function (credentials) {
        return new Promise(function (resolve, reject) {
            CompanyRepository.update_company_branch(credentials).then(company => {
                resolve(company);
            }, error => {
                reject(error);
            });
        });
    },

};