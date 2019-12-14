var models = require('../models/models.js');
var model_deal = require('../models/deals_model');
var fields = require('../constant/field.js');
var commonRepository = require('./common.js');
var bcrypt = require('bcryptjs');

var UserRepository = {
    GetAll: function () {
        return new Promise(function (resolve, reject) {
            models.User.findAll().then(existingUsers => {
                resolve(existingUsers);
            }, error => {
                reject(error);
            });
        });
    },
    getUser: function (email) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({ where: { email: email } }).then(user => {
                if (user == null) {
                    resolve(null);

                } else {
                    var isDeleted = delete user.dataValues['password'];
                    var isDeletedOTP = delete user.dataValues['otp'];
                    if (isDeleted && isDeletedOTP) {
                        resolve(user);
                    }
                }
            }, error => {
                reject(error);
            });
        });
    },
    deleteUser: function (id) {
        return new Promise(function (resolve, reject) {
            models.User.destroy({ where: { user_admin_id: id } }).then(response => {
                if (response) {
                    resolve(null);
                } else {
                    resolve(response);
                }
            }, error => {
                reject(error);
            });
        });
    },



    getAllUserData: function (id) {
        return new Promise(function (resolve, reject) {
            models.User.hasMany(models.Account, { foreignKey: 'fk_user_id' });
            models.User.hasMany(model_deal.Deals, { foreignKey: 'user_id' });
            models.User.hasMany(models.Purchase, { foreignKey: 'user_id' });
            models.User.hasMany(models.Advertising, { foreignKey: 'user_id' });
            models.User.findOne({
                where: { user_admin_id: id },
                include: [{
                    model: models.Account
                }, {
                    model: model_deal.Deals
                }, {
                    model: models.Purchase
                }, {
                    model: models.Advertising
                }]
            }).then(user => {
                if (!user) {
                    resolve(null);
                } else {
                    delete user.dataValues['password'];
                    resolve(user);
                }
            }, error => {
                reject(error);
            });
        });
    },
    Login: function (email, password) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({
                attributes: ['user_admin_id', 'password', 'email', 'phone', 'first_name', 'last_name', 'active'],
                where: { email: email }
            }).then(users => {
                console.log(users);
                if (users) {
                    var passwordIsValid = bcrypt.compareSync(password, users.password);
                    console.log(passwordIsValid);
                    if (!passwordIsValid) {
                        resolve(null)
                    } else {
                        var isDeleted = delete users.dataValues['password'];
                        if (isDeleted) {
                            resolve(users)
                        } else {
                            resolve(null)
                        }
                    }
                } else {
                    resolve(null);
                }
            }, error => {
                reject(error);
            });
        });
    },
    Check_email: function (email) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({ attributes: ['email'], where: { email: email } }).then(users => {
                if (users) {
                    resolve(users['dataValues']);
                } else {
                    resolve(null);
                }

            }, error => {
                reject(error);
            });
        });
    },
    Login_Token: function (id, token) {
        return new Promise(function (resolve, reject) {
            console.log(id, token);
            models.User.update({ session_id: token }, { where: { user_admin_id: id } }).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });


        });
    },
    Update_otp: function (email) {
        return new Promise(function (resolve, reject) {
            var otp_val = Math.floor(1000 + Math.random() * 9000);
            models.User.update({ otp: otp_val }, { where: { email: email } }).then(function (result) {
                models.User.findOne({ attributes: ['email'], where: { email: email } }).then(users => {
                    resolve(users);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });


        });
    },
    Check: function (email, password, first_name, last_name, phone, user_type) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({ attributes: ['user_admin_id'], where: { email: email } }).then(users => {
                if (users == null) {
                    var otp_val = Math.floor(1000 + Math.random() * 9000);
                    models.User.create({
                        email: email,
                        password: password,
                        first_name: first_name,
                        last_name: last_name,
                        phone: phone,
                        otp: otp_val,
                        user_type: user_type,
                        photo: first_name + '.png'
                    }).then(users => {
                        console.log(users['dataValues']);
                        var isDeleted = delete users.dataValues['password'];
                        // var isDeletedOTP = delete users.dataValues['otp'];
                        console.log(users['dataValues']);
                        if (isDeleted) {
                            resolve(users);
                        } else {
                            resolve(null);
                        }

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
    Check_otp: function (email, otp) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({ attributes: ['otp', 'email'], where: { email: email, otp: otp } }).then(users => {
                resolve(users);
            }, error => {
                reject(error);
            });
        });
    },
    Check_token: function (token) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({ attributes: ['session_id'], where: { session_id: token } }).then(users => {
                resolve(users);
            }, error => {
                reject(error);
            });
        });
    },
    Activate: function (id, otp) {
        return new Promise(function (resolve, reject) {
            models.User.update({ active: 1 }, { where: { user_admin_id: id } }).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    Change_pass: function (token, password) {
        return new Promise(function (resolve, reject) {
            models.User.update({ password: password }, { where: { session_id: token } }).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    },
    Update_pass: function (otp, password, email) {
        return new Promise(function (resolve, reject) {
            var hashPassword = bcrypt.hashSync(password, 8);
            console.log(hashPassword);
            models.User.update({ password: hashPassword }, { where: { otp: otp, email: email } }).then(function (result) {
                console.log(result);
                models.User.findOne({ attributes: ['email'], where: { email: email } }).then(results => {
                    resolve(results);
                }, error => {
                    reject(error);
                });

            }, function (error) {
                reject(error);
            });
        });
    },
    Resend_otp: function (email) {
        return new Promise(function (resolve, reject) {
            var otp_val = Math.floor(1000 + Math.random() * 9000);
            models.User.update({ otp: otp_val }, { where: { email: email } }).then(function (result) {
                models.User.findOne({ attributes: ['email'], where: { email: email } }).then(users => {
                    resolve(users);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },
    update_profile: function (first_name, last_name, phone, email) {
        return new Promise(function (resolve, reject) {
            models.User.update({
                first_name: first_name,
                last_name: last_name,
                phone: phone,

            }, { where: { email: email } }).then(function (result) {
                models.User.findOne({ where: { email: email }, attributes: ['email', 'first_name', 'last_name', 'phone'] }).then(users => {
                    resolve(users);
                }, error => {
                    reject(error);
                });


            }, function (error) {
            }, function (error) {
                reject(error);
            });
        });
    },


    Get_user: function (token) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({
                attributes: ['user_admin_id', 'email', 'first_name', 'last_name', 'address', 'phone', 'picture', 'lattitude', 'longitude', 'company_name', 'company_name_arabic'],
                where: { session_id: token }
            }).then(users => {
                resolve(users);
            }, error => {
                reject(error);
            });
        });
    },
};
Object.assign(UserRepository, commonRepository);
module.exports = UserRepository;