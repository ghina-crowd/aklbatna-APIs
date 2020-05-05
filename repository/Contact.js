var models = require('../models/models');
var commonRepository = require('./common.js');
const Sequelize = require('sequelize');
var contactRepository = {
    get: function (page) {
        return new Promise(function (resolve, reject) {

            var pageSize = 12; // page start from 0
            const offset = page * pageSize;

            models.Contact.findAndCountAll({ limit: pageSize, offset: offset, where: { active: 1 } }).then(Contact => {
                if (Contact == null) {
                    resolve([]);
                } else {
                    var reviewsTemp = Contact.rows;
                    Contact.Contacts = reviewsTemp;
                    delete Contact.rows;
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