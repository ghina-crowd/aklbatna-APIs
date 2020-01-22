var DashboardRepository = require('../repository/dashboard');


module.exports = {
    Admin: function () {
        return new Promise(function (resolve, reject) {
            DashboardRepository.Admin().then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    ServicePro: function (user_id) {
        return new Promise(function (resolve, reject) {
            DashboardRepository.ServicePro(user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    SalesRep: function (user_id) {
        return new Promise(function (resolve, reject) {
            DashboardRepository.SalesRep(user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    }
};