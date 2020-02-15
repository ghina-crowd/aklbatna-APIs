var UserRepository = require('../repository/users.js');
var bcrypt = require('bcryptjs');
var service = {
    login: function (email, password) {
        return new Promise(function (resolve, reject) {
            UserRepository.Login(email, password).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }

            }, error => {
                reject(error);
            });
        });
    },
    check_email: function (email) {
        return new Promise(function (resolve, reject) {
            UserRepository.Check_email(email).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    console.log(users);
                    resolve(users);
                }

            }, error => {
                reject(error);
            });
        });
    },
    getLanguage: function (req) {
        if (req.headers.language == 'ar') {
            return trans_message = ar_messages;
        } else if (req.headers.language == 'en') {
            var trans_message = messages;
        } else {
            return trans_message = messages;
        }
    },
    checkLanguage: function (req) {
        if (req.headers.language == 'ar') {
            return ar_messages;
        } else if (req.headers.language == 'en') {
            return trans_message = messages;
        } else {
            return messages;
        }
    },
    login_token: function (id) {
        return new Promise(function (resolve, reject) {
            UserRepository.Login_Token(id, token).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }

            }, error => {
                reject(error);
            });
        });
    },
    update_otp: function (email) {
        return new Promise(function (resolve, reject) {
            UserRepository.Update_otp(email).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }

            }, error => {
                reject(error);
            });
        });
    },
    update_SessionID: function (email, session_id) {
        return new Promise(function (resolve, reject) {
            UserRepository.Update_sessionID(email, session_id).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }

            }, error => {
                reject(error);
            });
        });
    },
    check_user_social: function (email, password, first_name, last_name, profile) {

        var password = bcrypt.hashSync(password, 8);
        return new Promise(function (resolve, reject) {
            UserRepository.CheckSocial(email, password, first_name, last_name, profile).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }

            }, error => {
                reject(error);
            });
        });
    },
    check_user: function (email, password, first_name, last_name, phone, user_type) {

        var password = bcrypt.hashSync(password, 8);
        return new Promise(function (resolve, reject) {
            UserRepository.Check(email, password, first_name, last_name, phone, user_type).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }
            }, error => {
                reject(error);
            });
        });
    },
    create_user_admin: function (email, password, first_name, last_name, phone, user_type) {
        var password = bcrypt.hashSync(password, 8);
        return new Promise(function (resolve, reject) {
            UserRepository.CreateUserAdmin(email, password, first_name, last_name, phone, user_type).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }
            }, error => {
                reject(error);
            });
        });
    },
    register_user: function (email, password, first_name, last_name, phone, user_type) {
        return new Promise(function (resolve, reject) {
            UserRepository.Register(email, password, first_name, last_name, phone, user_type).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }
            }, error => {
                reject(error);
            });
        });
    },
    check_otp: function (email, otp) {
        return new Promise(function (resolve, reject) {
            UserRepository.Check_otp(email, otp).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }
            }, error => {
                reject(error);
            });
        });
    },
    get_language: function (lang) {
        return new Promise(function (resolve, reject) {
            if (lang == 'ar') {

            } else if (lang == 'en') {
                // var trans_message = messages;
            } else {
                // var trans_message = messages;
            }
        });


    },
    check_token: function (token) {
        return new Promise(function (resolve, reject) {
            UserRepository.Check_token(token).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }

            }, error => {
                console.log('error' + error)
                reject(error);
            });
        });


    },
    activate_user: function (id, otp) {
        return new Promise(function (resolve, reject) {
            UserRepository.Activate(id, otp).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }

            }, error => {
                console.log('error' + error)
                reject(error);
            });
        });
    },
    change_pass: function (token, password) {
        return new Promise(function (resolve, reject) {
            UserRepository.Change_pass(token, password).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }

            }, error => {
                reject(error);
            });
        });
    },
    update_pass: function (otp, password, email) {
        return new Promise(function (resolve, reject) {
            UserRepository.Update_pass(otp, password, email).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }

            }, error => {
                reject(error);
            });
        });
    },
    resend_user: function (email) {
        return new Promise(function (resolve, reject) {
            UserRepository.Resend_otp(email).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }

            }, error => {
                reject(error);
            });
        });
    },
    update_profile: function (token, first_name, last_name, address, phone, picture, latitude, longitude, company_name) {
        return new Promise(function (resolve, reject) {
            UserRepository.Update_profile(token, first_name, last_name, address, phone, picture, latitude, longitude, company_name).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }

            }, error => {
                reject(error);
            });
        });
    },
    logout: function () {
        console.log("Invalidate token.");
    },
    get_user: function (user_id) {
        return new Promise(function (resolve, reject) {
            UserRepository.Get_user(user_id).then(users => {
                if (users == null) {
                    resolve(null);
                } else {
                    resolve(users['dataValues']);
                }

            }, error => {
                reject(error);
            });
        });
    },
};
module.exports = service;