var models = require('../models/models.js');
var commonRepository = require('./common.js');
var bcrypt = require('bcryptjs');
const sequelize = require('sequelize');
const Op = sequelize.Op;

var UserRepository = {

    GetAll: function (body) {
        return new Promise(function (resolve, reject) {
            var pageSize = 10;
            const offset = body.page * pageSize;

            var data = {};

            if (body.keyword && body.keyword != 'all') {
                data = {
                    [Op.or]: [{ first_name: { [Op.like]: '%' + body.keyword + '%' } }, { last_name: { [Op.like]: '%' + body.keyword + '%' } }, { email: { [Op.like]: '%' + body.keyword + '%' } }, { phone: { [Op.like]: '%' + body.keyword + '%' } }, { user_type: { [Op.like]: '%' + body.keyword + '%' } }, { user_id: { [Op.like]: '%' + (Number(body.keyword) - 1000) + '%' } }]
                }
            }
            if (body.user_type && body.user_type != '') {
                data.user_type = body.user_type;
            }


            models.User.hasOne(models.kitchens, { foreignKey: 'user_id' });

            if (body.page >= 0) {
                models.User.findAndCountAll({
                    limit: pageSize, offset: offset, where: data, include: [{ model: models.kitchens, attributes: ['kitchen_id', 'name_ar', 'name_en', 'user_id'] }]
                }).then(users => {


                    models.User.findAll({ where: { user_type: 'normal' } }).then((Normaluser => {
                        models.User.findAll({ where: { user_type: 'servicePro' } }).then((servicePorUser => {
                            var dealsTemp = users.rows;
                            users.users = dealsTemp;
                            users.normalUserCount = Normaluser.length;
                            users.serviceProUserCount = servicePorUser.length;
                            delete users.rows;
                            users.users.forEach(users => {
                                delete users['dataValues'].password; // for security reason we are now allowing to send password to anyone via any api lol :_)
                                delete users['dataValues'].otp;
                                if (String(users['dataValues'].user_type).toLowerCase() === 'salesrep') {
                                    users['dataValues'].code = String(1000 + Number(users['dataValues'].user_id));
                                } else {
                                    users['dataValues'].code = '';
                                }
                            });
                            resolve(users);

                        }), error => {
                            reject(error);
                        });



                    }), error => {
                        reject(error);
                    });



                    resolve(users);
                }, error => {
                    reject(error);
                });
            } else {
                models.User.findAll({
                    where: data, include: [{ model: models.kitchens, attributes: ['kitchen_id', 'name_ar', 'name_en', 'user_id'] }]
                }).then(users => {



                    models.User.findAll({ where: { user_type: 'normal' } }).then((Normaluser => {
                        models.User.findAll({ where: { user_type: 'servicePro' } }).then((servicePorUser => {
                            users.normalUserCount = Normaluser.length;
                            users.serviceProUserCount = servicePorUser.length;
                            users.forEach(users => {
                                delete users['dataValues'].password; // for security reason we are now allowing to send password to anyone via any api lol :_)
                                delete users['dataValues'].otp;
                                if (String(users['dataValues'].user_type).toLowerCase() === 'salesrep') {
                                    users['dataValues'].code = String(1000 + Number(users['dataValues'].user_id));
                                } else {
                                    users['dataValues'].code = '';
                                }
                            });

                            resolve(users);
                        }), error => {
                            reject(error);
                        });



                    }), error => {
                        reject(error);
                    });



                }, error => {
                    reject(error);
                });
            }
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


    getCountNormal: function () {
        return new Promise(function (resolve, reject) {
            models.User.findAll({ where: { user_type: 'normal' } }).then(user => {
                if (user == null) {
                    resolve([]);
                } else {
                    resolve(user);
                }
            }, error => {
                reject(error);
            });
        });
    },
    getCountSp: function () {
        return new Promise(function (resolve, reject) {
            models.User.findAll({ where: { user_type: 'ServicePro' } }).then(user => {
                if (user == null) {
                    resolve([]);
                } else {
                    resolve(user);
                }
            }, error => {
                reject(error);
            });
        });
    },
    getCountAdmin: function (email) {
        return new Promise(function (resolve, reject) {
            models.User.findAll({ where: { user_type: 'admin' } }).then(user => {
                if (user == null) {
                    resolve([]);
                } else {
                    resolve(user);
                }
            }, error => {
                reject(error);
            });
        });
    },
    getUserByID: function (id) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({ where: { user_id: id } }).then(user => {
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
            models.User.destroy({ where: { user_id: id } }).then(response => {
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
    Login: function (email, password) {

        models.User.hasOne(models.kitchens, { foreignKey: 'user_id' });
        return new Promise(function (resolve, reject) {
            models.User.findOne({

                where: { email: email }, include: [{ model: models.kitchens, attributes: ['kitchen_id'] }]

            }).then(users => {
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
            models.User.findOne({ attributes: ['email', 'user_type'], where: { email: email } }).then(users => {
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
            models.User.update({ session_id: token }, { where: { user_id: id } }).then(function (result) {
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
                models.User.findOne({ attributes: ['email', 'first_name', 'last_name'], where: { email: email } }).then(users => {
                    users['otp'] = otp_val;
                    resolve(users);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });


        });
    },
    CheckSocial: function (email, password, first_name, last_name, profile) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({ where: { email: email } }).then(users => {
                if (users == null) {
                    models.User.create({
                        email: email,
                        password: password,
                        first_name: first_name,
                        last_name: last_name,
                        profile: profile,
                        user_type: 'normal',
                        active: 1,
                    }).then(users => {

                        var isDeleted = delete users.dataValues['password'];
                        if (isDeleted) {
                            resolve(users)
                        } else {
                            resolve(null)
                        }

                    }, error => {
                        reject(error)
                    });
                } else {
                    var isDeleted = delete users.dataValues['password'];
                    if (isDeleted) {
                        resolve(users)
                    } else {
                        resolve(null)
                    }

                }
            }, error => {
                reject(error);
            });
        });
    },
    CreateActivity: function (user_id, type, status, created_deal_id, created_user_id) {
        return new Promise(function (resolve, reject) {
            models.Activities.create({
                admin_user_id: user_id,
                type: type,
                status: status,
                user_id: created_user_id,
                deal_id: created_deal_id
            }).then(activity => {
                resolve(activity);

            }, error => {
                reject(error)
            });
        });
    },

    Check: function (email, password, first_name, last_name, phone, user_type) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({ attributes: ['user_id'], where: { email: email } }).then(users => {
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
                        photo: first_name,
                        active: 0,
                    }).then(users => {
                        console.log(users['dataValues']);
                        var isDeleted = delete users.dataValues['password'];
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
    CreateUserAdmin: function (email, password, first_name, last_name, phone, user_type, active, profile) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({ attributes: ['user_id', 'user_type'], where: { email: email } }).then(users => {
                if (users == null) {

                    var otp_val = Math.floor(1000 + Math.random() * 9000);

                    models.User.create({

                        email: email,
                        account_status: 'Pending',
                        password: password,
                        first_name: first_name,
                        last_name: last_name,
                        phone: phone,
                        otp: otp_val,
                        user_type: user_type,
                        photo: first_name,
                        active: active,
                        profile: profile

                    }).then(users => {
                        var isDeleted = delete users.dataValues['password'];
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
            models.User.update({ active: 1 }, { where: { user_id: id } }).then(function (result) {
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
                models.User.findOne({ attributes: ['email'], where: { otp: otp, email: email } }).then(results => {
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
                models.User.findOne({ attributes: ['email', 'otp', 'user_type'], where: { email: email } }).then(users => {
                    // console.log(users);
                    resolve(users);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },

    update_profile: function (first_name, last_name, phone, email, newsletter, old_password, new_password, profile, fcm) {

        console.log(profile);
        return new Promise(function (resolve, reject) {
            if (new_password && old_password) {
                var hashPassword = bcrypt.hashSync(new_password, 8);
                models.User.findOne({ where: { email: email }, attributes: ['password'] }).then(users => {
                    var passwordIsValid = bcrypt.compareSync(old_password, users.password);
                    if (!passwordIsValid) {
                        resolve(0)
                    } else {
                        if (!newsletter) {
                            newsletter = 0;
                        }
                        models.User.update({
                            first_name: first_name,
                            last_name: last_name,
                            phone: phone,
                            newsletter: newsletter,
                            password: hashPassword,
                            profile: profile,
                            fcm: fcm
                        }, { where: { email: email } }).then(function (result) {
                            models.User.findOne({ where: { email: email }, attributes: ['user_id', 'email', 'first_name', 'last_name', 'phone', 'profile', 'newsletter', 'fcm'] }).then(users => {
                                resolve(users);
                            }, error => {
                                reject(error);
                            });
                        }, function (error) {
                            reject(error);
                        });
                    }

                }, error => {
                    reject(error);
                });
            } else {
                if (!newsletter) {
                    newsletter = 0;
                }
                models.User.update({
                    first_name: first_name,
                    last_name: last_name,
                    phone: phone,
                    newsletter: newsletter,
                    profile: profile,
                    fcm: fcm
                }, { where: { email: email } }).then(function (result) {
                    models.User.findOne({ where: { email: email }, attributes: ['user_id', 'email', 'first_name', 'last_name', 'phone', 'profile', 'newsletter', 'fcm'] }).then(users => {
                        resolve(users);
                    }, error => {
                        reject(error);
                    });
                }, function (error) {
                    reject(error);
                });
            }
        });
    },
    UpdateFCM: function (fcm, email) {

        return new Promise(function (resolve, reject) {
            {
                models.User.update({
                    fcm: fcm
                }, { where: { email: email } }).then(function (result) {
                    models.User.findOne({ where: { email: email }, attributes: ['user_id', 'fcm'] }).then(users => {
                        resolve(users);
                    }, error => {
                        reject(error);
                    });
                }, function (error) {
                    reject(error);
                });
            }
        });
    },
    update_profile_picture: function (profile, user_id) {
        return new Promise(function (resolve, reject) {
            {
                models.User.update({
                    profile: user_id
                }, { where: { user_id: profile } }).then(function (result) {
                    models.User.findOne({ where: { user_id: profile }, attributes: ['profile'] }).then(users => {
                        resolve(users);
                    }, error => {
                        reject(error);
                    });
                }, function (error) {
                    reject(error);
                });
            }
        });
    },

    update_user_type: function (body) {
        return new Promise(function (resolve, reject) {
            models.User.update({
                user_type: body.user_type,
            }, { where: { user_id: body.user_id } }).then(function (result) {
                models.User.findOne({ where: { user_id: body.user_id }, attributes: ['user_type'] }).then(users => {
                    resolve(users);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },

    blockOrUnblock: function (body) {
        console.log(body);
        return new Promise(function (resolve, reject) {
            models.User.update({
                active: body.active,
            }, { where: { user_id: body.user_id } }).then(function (result) {
                models.User.findOne({ where: { user_id: body.user_id }, attributes: ['user_id', 'email', 'first_name', 'last_name', 'phone', 'profile', 'newsletter', 'active'] }).then(users => {
                    resolve(users);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },

    Get_user: function (user_id) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({
                attributes: ['user_id', 'email', 'first_name', 'last_name', 'phone', 'profile'],
                where: { user_id: user_id }
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