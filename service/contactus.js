var ContactRepository = require('../repository/contactus');


module.exports = {
    getAllContactUs: function () {
        return new Promise(function (resolve, reject) {
            ContactRepository.getAllContactUS().then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getWhere: async function (company_id) {
        return new Promise(async function (resolve, reject) {
            ContactRepository.getWhere(company_id).then(async user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    createContactUs: function (newContactData) {
        return new Promise(function (resolve, reject) {
            ContactRepository.createAccount(newContactData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    update: function (newContactData) {
        return new Promise(function (resolve, reject) {
            ContactRepository.update(newContactData).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },

    Delete: function (contact_id) {
        return new Promise(function (resolve, reject) {
            ContactRepository.deleteContact(contact_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    }
};