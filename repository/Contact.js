var models = require('../models/models');
var commonRepository = require('./common.js');
const Sequelize = require('sequelize');
var contactRepository = {
    get: function () {
        return new Promise(function (resolve, reject) {
            models.Contact.findAll({ where: { active: 1 } }).then(Contact => {
                if (Contact == null) {
                    resolve([]);
                } else {
                    resolve(Contact);
                }
            }, error => {
                reject(error);
            });
        });
    },
    create: function (newcontactData) {
        return new Promise(function (resolve, reject) {
            models.Contact.create({
                name: newcontactData.name,
                email: newcontactData.email,
                message: newcontactData.message,
                active: 1, // default 
            }).then(contact => {
                console.log(contact['dataValues']);
                resolve(contact);
            }, error => {
                reject(error)
            });
        });
    },
    delete: function (contact_id) {
        return new Promise(function (resolve, reject) {
            console.log(contact_id)
            models.Contact.destroy({ where: { contact_id: contact_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },
};


Object.assign(contactRepository, commonRepository);
module.exports = contactRepository;