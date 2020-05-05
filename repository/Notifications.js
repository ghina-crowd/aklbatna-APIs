var models = require('../models/models.js');
var commonRepository = require('./common.js');
var lang = require('../app');
var notifications;

var notificationRepository = {


    getAllnotifications: function (id, page) {

        var pageSize = 20; // page start from 0
        const offset = page * pageSize;

        return new Promise(function (resolve, reject) {
            models.Notifications.findAndCountAll({ limit: pageSize, offset: offset, where: { user_id: 'admin', user_id: id } }).then((notifications => {
                if (notifications == null) {
                    resolve(null);
                } else {
                    models.Notifications.findAll({ limit: pageSize, offset: offset, where: { user_id: 'admin', read: 0, user_id: id } }).then((count => {

                        var reviewsTemp = notifications.rows;
                        notifications.notifications = reviewsTemp;
                        notifications.unread = count.length;
                        delete notifications.rows;

                        resolve(notifications);


                    }), error => {
                        reject(error);
                    })

                }
            }), error => {
                reject(error);
            })
        });
    },


    create: function (newnotificationData) {
        return new Promise(function (resolve, reject) {
            models.Notifications.create({
                title: newnotificationData.title,
                message: newnotificationData.message,
                action: newnotificationData.action,
                user_id: newnotificationData.user_id ? newnotificationData.user_id : 'admin',
            }).then(contact => {
                resolve(contact);
            }, error => {
                reject(error)
            });
        });
    },


    deletenotification: function (notification_id) {
        return new Promise(function (resolve, reject) {
            models.Notifications.destroy({ where: { notification_id: notification_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },
    readnotification: function (notification_id) {
        console.log(notification_id);
        return new Promise(function (resolve, reject) {
            models.Notifications.update({ read: 1 }, { where: { notification_id: notification_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    }

};
Object.assign(notificationRepository, commonRepository);
module.exports = notificationRepository;