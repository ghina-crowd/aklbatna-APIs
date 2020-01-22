var RequestsRepository = require('../repository/requests');
module.exports = {
    Get: function (id) {
        return new Promise(function (resolve, reject) {
            RequestsRepository.Get(id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    GetAll: function (id) {
        return new Promise(function (resolve, reject) {
            RequestsRepository.GetAll().then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    Create: function (newRequestData) {
        return new Promise(function (resolve, reject) {
            RequestsRepository.Create(newRequestData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    Update: function (newRequestData) {
        return new Promise(function (resolve, reject) {
            RequestsRepository.Update(newRequestData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    Delete: function (newDeleteData) {
        return new Promise(function (resolve, reject) {
            RequestsRepository.Delete(newDeleteData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
};