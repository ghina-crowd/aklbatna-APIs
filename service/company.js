var CompanyRepository = require('../repository/company');
module.exports = {
    filter_companies: function (latitude, longitude, location_name,page) {
        return new Promise(function (resolve, reject) {
            CompanyRepository.filter_companies(latitude, longitude, location_name, page).then(deals => {
                resolve(deals);
            }, error => {
                reject(error);
            });
        });
    },

};