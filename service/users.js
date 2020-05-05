var UserRepository = require('../repository/users.js');
var fields = require('../constant/field.js');
var models = require('../models/models.js');
module.exports = {
    GetAllUser: function (body) {
        return new Promise(function (resolve, reject) {
            UserRepository.GetAll(body).then(users => {
                resolve(users);
            }, error => {
                reject(error);
            });
        });
    },


    GetUser: function (email) {
        return new Promise(function (resolve, reject) {
            UserRepository.getUser(email).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    DeleteUser: function (id) {
        return new Promise(function (resolve, reject) {
            UserRepository.deleteUser(id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    GetAllUserData: function (id) {
        return new Promise(function (resolve, reject) {
            UserRepository.getAllUserData(id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    Create: function (newUserData) {
        return new Promise(function (resolve, reject) {
            var newUserModel = {};
            newUserModel[fields.NAME] = newUserData.name;
            newUserModel[fields.SHORT_NAME] = newUserData.short_name;
            newUserModel[fields.MOBILE_CODE] = newUserData.mobile_code;
            newUserModel[fields.DELETED] = false;
            var newUser = models.User.build(newUserModel);
            UserRepository.Save(newUser).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    Login: function (data) {
        return new Promise(function (resolve, reject) {
            UserRepository.Login(data.email, data.password).then(existing_user => {
                resolve(existing_user);
                return existing_user;
            }, error => {
                reject(error);
            });
        });
    },
    Update: function (first_name, last_name, phone, email, newsletter, new_password, old_password, profile, fcm) {
        return new Promise(function (resolve, reject) {
            UserRepository.update_profile(first_name, last_name, phone, email, newsletter, new_password, old_password, profile, fcm).then(user => {
                resolve(user);
            }, function (error) {
                reject(error);
            });

        }, error => {
            reject(error);
        });

    },
    UpdateFCM: function (fcm, email) {
        return new Promise(function (resolve, reject) {
            UserRepository.UpdateFCM(fcm, email).then(user => {
                resolve(user);
            }, function (error) {
                reject(error);
            });

        }, error => {
            reject(error);
        });

    },
    update_profile_picture: function (profile, user_id) {
        return new Promise(function (resolve, reject) {
            UserRepository.update_profile_picture(profile, user_id).then(user => {
                resolve(user);
            }, function (error) {
                reject(error);
            });

        }, error => {
            reject(error);
        });

    },
    UpdateUserType: function (body) {
        return new Promise(function (resolve, reject) {
            UserRepository.update_user_type(body).then(user => {
                resolve(user);
            }, function (error) {
                reject(error);
            });

        }, error => {
            reject(error);
        });

    },
    blockOrUnblock: function (body) {
        return new Promise(function (resolve, reject) {
            UserRepository.blockOrUnblock(body).then(user => {
                resolve(user);
            }, function (error) {
                reject(error);
            });

        }, error => {
            reject(error);
        });
    },
    getUserActivities: function (id) {
        return new Promise(function (resolve, reject) {
            UserRepository.getUserActivities(id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    getBestSeller: function () {
        return new Promise(function (resolve, reject) {
            UserRepository.getBestSeller().then(users => {
                resolve(users);
            }, error => {
                reject(error);
            });
        });
    },
};