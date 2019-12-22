var models = require('../models/models.js');
var commonRepository = require('./common.js');

var ContactRepository = {
    getAllContactUS: function () {
        return new Promise(function (resolve, reject) {
            models.ContactUs.findAll().then((contact => {
                if (contact == null) {
                    resolve(null);
                } else {
                    resolve(contact);
                }
            }), error => {
                reject(error);
            })
        });
    },

    createAccount: function (newContactUsData) {
        return new Promise(function (resolve, reject) {
            models.ContactUs.create({
                user_id: newContactUsData.user_id,
                name: newContactUsData.name,
                email: newContactUsData.email,
                phone: newContactUsData.phone,
                subject: newContactUsData.subject,
                message: newContactUsData.message
            }).then(contact => {
                resolve(contact);
            }, error => {
                reject(error)
            });
        });
    },


    deleteContact: function (contact_id) {
        return new Promise(function (resolve, reject) {
            models.ContactUs.destroy({ where: { contact_id: contact_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    }

};
Object.assign(ContactRepository, commonRepository);
module.exports = ContactRepository;