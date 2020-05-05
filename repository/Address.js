var models = require('../models/models.js');
var commonRepository = require('./common.js');
var lang = require('../app');
var cities;
var AddressRepository = {

    get: function (user_id) {
        if (lang.acceptedLanguage == 'en') {
            cities = ['city_id', ['name_en', 'name']];
        } else {
            cities = ['city_id', ['name_ar', 'name']];
        }

        models.Address.belongsTo(models.City, { foreignKey: 'city_id' })
        return new Promise(function (resolve, reject) {
            models.Address.findAll({
                where: { user_id: user_id }, include: [{ model: models.City, attributes: cities }]
            }).then((Address => {
                if (Address == null) {
                    resolve(null);
                } else {
                    resolve(Address);
                }
            }), error => {
                reject(error);
            });
        });
    },


    create: function (newAddressData) {
        return new Promise(function (resolve, reject) {
            models.Address.create({
                Address: newAddressData.Address ? newAddressData.Address : '',
                city_id: newAddressData.city_id ? newAddressData.city_id : 0,
                area: newAddressData.area ? newAddressData.area : '',
                type: newAddressData.type ? newAddressData.type : '',
                street: newAddressData.street ? newAddressData.street : '',
                building: newAddressData.building ? newAddressData.building : '',
                apartment: newAddressData.apartment ? newAddressData.apartment : '',
                floor: newAddressData.floor ? newAddressData.floor : '',
                additional: newAddressData.additional ? newAddressData.additional : '',
                user_id: newAddressData.user_id ? newAddressData.user_id : 0,
                landline: newAddressData.landline ? newAddressData.landline : '',
                phone: newAddressData.phone ? newAddressData.phone : '',
            }).then(Address => {
                resolve(Address);
            }, error => {
                reject(error)
            });
        });
    },

    update: function (newAddressData) {
        return new Promise(function (resolve, reject) {
            models.Address.update({
                Address: newAddressData.Address ? newAddressData.Address : '',
                area: newAddressData.area ? newAddressData.area : '',
                type: newAddressData.type ? newAddressData.type : '',
                street: newAddressData.street ? newAddressData.street : '',
                city_id: newAddressData.city_id ? newAddressData.city_id : 0,
                building: newAddressData.building ? newAddressData.building : '',
                apartment: newAddressData.apartment ? newAddressData.apartment : '',
                floor: newAddressData.floor ? newAddressData.floor : '',
                additional: newAddressData.additional ? newAddressData.additional : '',
                landline: newAddressData.landline ? newAddressData.landline : '',
                phone: newAddressData.phone ? newAddressData.phone : '',
            }, { where: { address_id: newAddressData.address_id } }).then(Address => {


                if (lang.acceptedLanguage == 'en') {
                    cities = ['city_id', ['name_en', 'name']];
                } else {
                    cities = ['city_id', ['name_ar', 'name']];
                }
        
                models.Address.belongsTo(models.City, { foreignKey: 'city_id' })

                models.Address.findOne({
                    where: { address_id: newAddressData.address_id }, include: [{ model: models.City, attributes: cities }]
                }).then((Address => {
                    if (Address == null) {
                        resolve(null);
                    } else {
                        resolve(Address);
                    }
                }), error => {
                    reject(error);
                });


            }, error => {
                reject(error)
            });
        });
    },
    delete: function (Address_id) {
        return new Promise(function (resolve, reject) {
            models.Address.destroy({ where: { Address_id: Address_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    }
};
Object.assign(AddressRepository, commonRepository);
module.exports = AddressRepository;