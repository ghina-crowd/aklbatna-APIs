
var models = require('../models/models.js');
var commonRepository = require('./common.js');
var utils = require('../util/utils');
var RequestsRepository = {
    Get: function (id) {
        return new Promise(function (resolve, reject) {
            models.Requests.belongsTo(models.User, { foreignKey: 'request_to', targetKey: 'user_admin_id' });
            models.Requests.findAll({
                where: { request_to: id },
                include: [{
                    model: models.User,
                }]
            }).then(requests => {

                requests.forEach(request => {
                    if (request['dataValues'].user_admin) {
                        if (String(request['dataValues'].user_admin['dataValues'].user_type).toLowerCase() === 'salesrep') {
                            request['dataValues'].user_admin['dataValues'].code = String(1000 + Number(request['dataValues'].user_admin['dataValues'].user_admin_id));
                        } else {
                            request['dataValues'].user_admin['dataValues'].code = '';
                        }
                    }
                });



                resolve(requests);
            }, error => {
                reject(error);
            });
        });

    },

    GetAll: function () {
        return new Promise(function (resolve, reject) {
            models.Requests.belongsTo(models.User, { foreignKey: 'request_to', targetKey: 'user_admin_id' });
            models.Requests.findAll({
                include: [{
                    model: models.User,
                }]
            }).then(requests => {

                requests.forEach(request => {
                    if (request['dataValues'].user_admin) {
                        if (String(request['dataValues'].user_admin['dataValues'].user_type).toLowerCase() === 'salesrep') {
                            request['dataValues'].user_admin['dataValues'].code = String(1000 + Number(request['dataValues'].user_admin['dataValues'].user_admin_id));
                        } else {
                            request['dataValues'].user_admin['dataValues'].code = '';
                        }
                    }
                });



                resolve(requests);
            }, error => {
                reject(error);
            });
        });

    },
    Create: function (newRequestsData) {
        if (!newRequestsData.request_from) {
            return new Promise(function (resolve, reject) {
                models.Requests.create({
                    request_from: newRequestsData.request_from,
                    request_to: newRequestsData.request_to,
                    first_name: newRequestsData.first_name,
                    last_name: newRequestsData.last_name,
                    phone: newRequestsData.phone,
                    status: 0,
                    type: newRequestsData.type,
                }).then(requesst => {
                    console.log(requesst['dataValues']);
                    resolve(requesst);
                }, error => {
                    reject(error)
                });
            });
        } else {
            return new Promise(function (resolve, reject) {
                models.User.findOne({ where: { user_admin_id: newRequestsData.request_from } }).then(user => {
                    if (user) {
                        models.Requests.create({
                            request_from: newRequestsData.request_from,
                            request_to: newRequestsData.request_to,
                            first_name: user['dataValues'].first_name,
                            last_name: user['dataValues'].last_name,
                            phone: user['dataValues'].phone,
                            status: 0,
                            type: newRequestsData.type,
                        }).then(requesst => {
                            console.log(requesst['dataValues']);
                            RequestsRepository.SendEmail(requesst['dataValues'])
                            resolve(requesst);
                        }, error => {
                            reject(error)
                        });
                    } else {
                        reject(user)
                    }
                }, error => {
                    reject(error)
                });
            });



        }

    },

    SendEmail: function (request) {

        if (request.request_to) {
            var emails = [];
            models.User.findOne({ where: { user_admin_id: request.request_to }, attributes: ['email'] }).then(users => {
                utils.SendEmail(users['dataValues'].email, 'Coboney Request', '<p>The Service provider sent request to  add create account  .</p>' + '<p>Name: ' + request.first_name + ' ' + request.last_name + ' .</p>' + '<p>Phone: ' + request.phone + ' ' + ' .</p>');
            });
        } else {
            var emails = [];
            models.User.findAll({ where: { user_type: 'SalesRep' }, attributes: ['email'] }).then(users => {
                users.forEach(item => {
                    emails.push(item['dataValues'].email)
                });
                console.log(emails)
                utils.SendEmails(emails, 'Coboney Request', '<p>Dear Sales ,</p>' + '</p> The Service provider sent request to  add new deal .</p>' + '<p>Name: ' + request.first_name + ' ' + request.last_name + ' .</p>' + '<p>Phone: ' + request.phone + ' ' + ' .</p>');
            });
        }

    },
    Update: function (newRequestsData) {
        return new Promise(function (resolve, reject) {
            models.Requests.update({
                request_from: newRequestsData.request_from,
                request_to: newRequestsData.request_to,
                first_name: newRequestsData.first_name,
                last_name: newRequestsData.last_name,
                phone: newRequestsData.phone,
                status: newRequestsData.status,
                type: newRequestsData.type,
            }, { where: { request_id: newRequestsData.request_id } }).then(function (result) {
                models.Requests.findOne({ where: { request_id: newRequestsData.request_id } }).then(requests => {
                    resolve(requests);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });

    },
    Delete: function (request_id) {
        return new Promise(function (resolve, reject) {
            models.Requests.destroy({ where: { request_id: request_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },
};
Object.assign(RequestsRepository, commonRepository);
module.exports = RequestsRepository;