var models = require('../models/models.js');
var model_deal = require('../models/deals_model');
var model_company = require('../models/company_model');
var model_sub_deal = require('../models/sub_deals_model');
var commonRepository = require('./common.js');
var bcrypt = require('bcryptjs');
const sequelize = require('sequelize');
const Op = sequelize.Op;

var UserRepository = {
    GetAll: function (page, keyword) {
        return new Promise(function (resolve, reject) {
            console.log('all with page' + keyword)
            var pageSize = 10; // page start from 0
            const offset = page * pageSize;

            var data = {};

            if (keyword && keyword != 'all') {
                data = {
                    [Op.or]: [{ first_name: { [Op.like]: '%' + keyword + '%' } }, { last_name: { [Op.like]: '%' + keyword + '%' } }, { email: { [Op.like]: '%' + keyword + '%' } }, { phone: { [Op.like]: '%' + keyword + '%' } }, { user_type: { [Op.like]: '%' + keyword + '%' } }, { user_admin_id: { [Op.like]: '%' + (Number(keyword) - 1000) + '%' } }]
                }
            }

            models.User.findAndCountAll({
                limit: pageSize, offset: offset, where: data
            })
                .then(users => {
                    var dealsTemp = users.rows;
                    users.users = dealsTemp;
                    delete users.rows;
                    users.users.forEach(users => {
                        delete users['dataValues'].password; // for security reason we are now allowing to send password to anyone via any api lol :_)
                        delete users['dataValues'].otp;
                        if (String(users['dataValues'].user_type).toLowerCase() === 'salesrep') {
                            users['dataValues'].code = String(1000 + Number(users['dataValues'].user_admin_id));
                        } else {
                            users['dataValues'].code = '';
                        }

                    });
                    resolve(users);
                }, error => {
                    reject(error);
                });
        });
    },
    GetAllByType: function (page, type) {
        return new Promise(function (resolve, reject) {
            console.log('all with page and type')
            var pageSize = 10; // page start from 0
            const offset = page * pageSize;
            models.User.findAndCountAll({ where: { user_type: type }, limit: pageSize, offset: offset })
                .then(users => {
                    var dealsTemp = users.rows;
                    users.users = dealsTemp;
                    delete users.rows;
                    users.users.forEach(users => {
                        delete users['dataValues'].password; // for security reason we are now allowing to send password to anyone via any api lol :_)
                        delete users['dataValues'].otp;
                    });
                    resolve(users);
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
            model_deal.Deals.hasMany(model_sub_deal.SubDeals, { foreignKey: 'deal_id' });
            models.User.hasMany(models.Purchase, { foreignKey: 'user_id' });
            models.User.hasMany(models.Advertising, { foreignKey: 'user_id' });
            models.User.hasMany(models.Activities, { foreignKey: 'user_id' });
            models.User.hasOne(model_company.Company, { foreignKey: 'user_id' });
            model_company.Company.hasMany(model_company.Company_Branches, { foreignKey: 'company_id' });

            models.User.findOne({
                where: { user_admin_id: id },
                include: [{
                    model: models.Account
                }, {
                    model: model_deal.Deals,
                    include: [{
                        model: model_sub_deal.SubDeals
                    }]
                }, {
                    model: models.Purchase
                }, {
                    model: models.Advertising
                }, {
                    model: models.Activities
                }, {
                    model: model_company.Company,
                    include: [{
                        model: model_company.Company_Branches
                    }]
                }]
            }).then(user => {
                if (!user) {
                    resolve(null);
                } else {
                    delete user.dataValues['password'];

                    if (user.dataValues['user_type'] == 'servicePro') {
                        resolve(user);
                    }
                    else {
                        resolve(null);
                    }
                }
            }, error => {
                reject(error);
            });
        });
    },
    Login: function (email, password) {
        return new Promise(function (resolve, reject) {
            models.User.hasOne(model_company.Company, { foreignKey: 'user_id' });
            model_company.Company.hasMany(model_company.Company_Branches, { foreignKey: 'company_id' });
            models.User.findOne({
                attributes: ['user_admin_id', 'password', 'email', 'phone', 'first_name', 'last_name', 'active', 'user_type'],
                where: { email: email },
                include: [{
                    model: model_company.Company,
                    include: [{
                        model: model_company.Company_Branches
                    }]
                }]
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

    CheckSocial: function (email, password, first_name, last_name) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({ attributes: ['user_admin_id', 'email', 'first_name', 'last_name'], where: { email: email } }).then(users => {
                if (users == null) {
                    var otp_val = Math.floor(1000 + Math.random() * 9000);
                    models.User.create({
                        email: email,
                        password: password,
                        first_name: first_name,
                        last_name: last_name,
                        active: 1,
                    }).then(users => {

                        resolve(users);

                    }, error => {
                        reject(error)
                    });
                } else {
                    resolve(users)
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
            models.User.findOne({ attributes: ['user_admin_id'], where: { email: email } }).then(users => {
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
    CreateUserAdmin: function (email, password, first_name, last_name, phone, user_type) {
        return new Promise(function (resolve, reject) {
            models.User.findOne({ attributes: ['user_admin_id'], where: { email: email } }).then(users => {
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
                        active: 1,
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
                models.User.findOne({ attributes: ['email', 'otp'], where: { email: email } }).then(users => {
                    console.log(users);
                    resolve(users);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },
    update_profile: function (first_name, last_name, phone, email, subscribe, old_password, new_password) {

        console.log(old_password);
        console.log(new_password);

        return new Promise(function (resolve, reject) {
            if (new_password && old_password) {
                var hashPassword = bcrypt.hashSync(new_password, 8);
                models.User.findOne({ where: { email: email }, attributes: ['password'] }).then(users => {
                    var passwordIsValid = bcrypt.compareSync(old_password, users.password);
                    if (!passwordIsValid) {
                        resolve(0)
                    } else {
                        if (!subscribe) {
                            subscribe = 0;
                        }
                        models.User.update({
                            first_name: first_name,
                            last_name: last_name,
                            phone: phone,
                            subscribe: subscribe,
                            password: hashPassword
                        }, { where: { email: email } }).then(function (result) {
                            models.User.findOne({ where: { email: email }, attributes: ['email', 'first_name', 'last_name', 'phone', 'subscribe'] }).then(users => {
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
                if (!subscribe) {
                    subscribe = 0;
                }
                models.User.update({
                    first_name: first_name,
                    last_name: last_name,
                    phone: phone,
                    subscribe: subscribe,

                }, { where: { email: email } }).then(function (result) {
                    models.User.findOne({ where: { email: email }, attributes: ['email', 'first_name', 'last_name', 'phone', 'subscribe'] }).then(users => {
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
            }, { where: { user_admin_id: body.user_admin_id } }).then(function (result) {
                models.User.findOne({ where: { user_admin_id: body.user_admin_id }, attributes: ['user_type'] }).then(users => {
                    resolve(users);
                }, error => {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    },
    update_account_status: function (body) {
        return new Promise(function (resolve, reject) {
            models.User.update({
                account_status: body.account_status,
                active: body.active,
            }, { where: { user_admin_id: body.user_admin_id } }).then(function (result) {
                models.User.findOne({ where: { user_admin_id: body.user_admin_id }, attributes: ['user_admin_id', 'account_status', 'active', 'user_type', 'email', 'first_name', 'last_name'] }).then(users => {
                    resolve(users);
                }, error => {
                    reject(error);
                });
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

    getUserActivities: function (user_id) {
        return new Promise(function (resolve, reject) {
            models.Activities.belongsTo(model_deal.Deals, { foreignKey: 'deal_id' });
            models.Activities.belongsTo(models.User, { foreignKey: 'user_id' });
            models.Activities.findAll({
                where: {
                    admin_user_id: user_id
                }, include: [{
                    model: model_deal.Deals
                }, {
                    model: models.User
                }]
            }).then(activitiesDeals => {
                console.log(activitiesDeals);
                resolve(activitiesDeals);
            }, error => {
                reject(error);
            });
        });

        // , where: { deal_id: deal_id }
    }, getBestSeller: function () {
        return new Promise(function (resolve, reject) {
            models.User.hasMany(model_deal.Deals, { foreignKey: 'user_id' });
            model_deal.Deals.hasMany(model_sub_deal.SubDeals, { foreignKey: 'deal_id' });
            models.User.findAll({
                attributes: ['first_name', 'last_name', 'phone', 'email', 'photo'],
                where: {
                    user_type: {
                        [Op.or]: ["servicePro", "salesRep"]
                    }
                }, include: [{
                    attributes: ['count_bought', 'final_rate'],
                    model: model_deal.Deals,
                    include: [{
                        attributes: ['id', 'count_bought'],
                        model: model_sub_deal.SubDeals
                    }]
                }]
            }).then(users => {
                if (users == null) {
                    resolve(null);
                } else {

                    users.forEach(users => {
                        users['dataValues'].all_deal_count_bought = 0;
                        users['dataValues'].deals.forEach(deals => {
                            console.log(deals['dataValues']);
                            deals['dataValues'].sub_deals.forEach(item => {
                                console.log(item['dataValues']);
                                deals['dataValues'].count_bought = deals['dataValues'].count_bought + item['dataValues'].count_bought;
                            });
                            users['dataValues'].all_deal_count_bought = users['dataValues'].all_deal_count_bought + deals['dataValues'].count_bought;
                        });
                        delete users['dataValues'].deals;
                    });

                    users.sort((a, b) => parseFloat(a["dataValues"].all_deal_count_bought) + parseFloat(b["dataValues"].all_deal_count_bought));
                    resolve(users);


                }
            }, error => {
                reject(error);
            });



        });
    },
};
Object.assign(UserRepository, commonRepository);
module.exports = UserRepository;