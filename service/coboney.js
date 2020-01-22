var CoboneyRepository = require('../repository/coboney');


module.exports = {
    get: function (type) {
        return new Promise(function (resolve, reject) {
            CoboneyRepository.get(type).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getMobile: function (type) {
        return new Promise(function (resolve, reject) {
            CoboneyRepository.getMobile(type).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    createContactUs: function (newContactData) {
        return new Promise(function (resolve, reject) {
            CoboneyRepository.createAccount(newContactData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    Delete: function (contact_id) {
        return new Promise(function (resolve, reject) {
            CoboneyRepository.deleteContact(contact_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    }
};