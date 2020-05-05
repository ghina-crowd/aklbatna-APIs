var models = require('../models/models.js');
var commonRepository = require('./common.js');
var lang = require('../app');
var subscribes;

var subscribeRepository = {

    getAllsubscribesAdmin: function () {
        return new Promise(function (resolve, reject) {
            models.Subscribe.findAll().then((subscribes => {
                if (subscribes == null) {
                    resolve(null);
                } else {
                    resolve(subscribes);
                }
            }), error => {
                reject(error);
            })
        });
    },
    update: function (newsubscribeData) {
        return new Promise(function (resolve, reject) {
            models.Subscribe.update({
                subscribe: newsubscribeData.subscribe
            }, { where: { subscribe_id: newsubscribeData.subscribe_id } }).then(subscribe => {
                models.Subscribe.findOne({ where: { subscribe_id: newsubscribeData.subscribe_id } }).then((subscribe => {
                    if (subscribe == null) {
                        resolve({});
                    } else {
                        resolve(subscribe);
                    }
                }), error => {
                    reject(error);
                })
            }, error => {
                reject(error)
            });
        });
    },


    createsubscribe: function (newsubscribeData) {
        return new Promise(function (resolve, reject) {
            models.Subscribe.findOne({ attributes: ['email'], where: { email: newsubscribeData.email } }).then(users => {
                if (users == null) {
                    models.Subscribe.create({
                        email: newsubscribeData.email,
                        subscribe: 1
                    }).then(contact => {
                        resolve(contact);
                    }, error => {
                        reject(error)
                    });

                } else {
                    resolve(null)
                }
            }, error => {
                reject(error);
            });

        });
    },


    deletesubscribe: function (subscribe_id) {
        return new Promise(function (resolve, reject) {
            models.Subscribe.destroy({ where: { subscribe_id: subscribe_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    }

};
Object.assign(subscribeRepository, commonRepository);
module.exports = subscribeRepository;