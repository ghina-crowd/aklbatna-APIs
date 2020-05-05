var notificationsRepository = require('../repository/Notifications');


module.exports = {
    getAll: function (id, page) {
        return new Promise(function (resolve, reject) {
            notificationsRepository.getAllnotifications(id, page).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    Delete: function (notifications_id) {
        return new Promise(function (resolve, reject) {
            notificationsRepository.deletenotification(notifications_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    },
    Read: function (id, notifications_id) {
        return new Promise(function (resolve, reject) {
            notificationsRepository.readnotification(id, notifications_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    }


};