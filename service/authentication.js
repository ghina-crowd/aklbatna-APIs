var models=require('../models/models.js');
var UserRepository=require('../repository/users.js');
var fields=require('../constant/field.js');
var service={
    login:function(email,password){
        return new Promise(function(resolve,reject){
            UserRepository.Login(email,password).then(users=>{
                if(users == null){
                    resolve(null);
                }else{
                    resolve(users['dataValues']);
                }

            },error=>{
                reject(error);
            });
        });
    },
    check_email:function(email){
        return new Promise(function(resolve,reject){
            UserRepository.Check_email(email).then(users=>{
                if(users == null){
                    resolve(null);
                }else{
                    resolve(users);
                }

            },error=>{
                reject(error);
            });
        });
    },
    login_token:function(id,token){
        return new Promise(function(resolve,reject){
            UserRepository.Login_Token(id,token).then(users=>{
                if(users == null){
                    resolve(null);
                }else{
                    resolve(users['dataValues']);
                }

            },error=>{
                reject(error);
            });
        });
    },
    update_otp:function(email){
        return new Promise(function(resolve,reject){
            UserRepository.Update_otp(email).then(users=>{
                if(users == null){
                    resolve(null);
                }else{
                    resolve(users['dataValues']);
                }

            },error=>{
                reject(error);
            });
        });
    },
    check_user:function(email,password,first_name,last_name,phone,user_type){
        return new Promise(function(resolve,reject){
            UserRepository.Check(email,password,first_name,last_name,phone,user_type).then(users=>{
                if(users == null){
                    resolve(null);
                }else{
                    resolve(users['dataValues']);
                }

            },error=>{
                reject(error);
            });
        });
    },
    register_user:function(email,password,first_name,last_name,phone,user_type){
        return new Promise(function(resolve,reject){
            UserRepository.Register(email,password,first_name,last_name,phone,user_type).then(users=>{
                if(users == null){
                    resolve(null);
                }else {
                    resolve(users['dataValues']);
                }
            },error=>{
                reject(error);
            });
        });
    },
    check_otp:function(token,otp){
        return new Promise(function(resolve,reject){
            UserRepository.Check_otp(token,otp).then(users=>{
                if(users == null){
                    resolve(null);
                }else{
                    resolve(users['dataValues']);
                }

            },error=>{
                reject(error);
            });
        });
    },
    check_token:function(token){
        return new Promise(function(resolve,reject){
            UserRepository.Check_token(token).then(users=>{
                if(users == null){
                    resolve(null);
                }else{
                    resolve(users['dataValues']);
                }

            },error=>{
                reject(error);
            });
        });
    },
    activate_user:function(token,otp){
        return new Promise(function(resolve,reject){
            UserRepository.Activate(token,otp).then(users=>{
                if(users == null){
                    resolve(null);
                }else{
                    resolve(users['dataValues']);
                }

            },error=>{
                reject(error);
            });
        });
    },
    change_pass:function(token,password){
        return new Promise(function(resolve,reject){
            UserRepository.Change_pass(token,password).then(users=>{
                if(users == null){
                    resolve(null);
                }else{
                    resolve(users['dataValues']);
                }

            },error=>{
                reject(error);
            });
        });
    },
    update_pass:function(otp,password){
        return new Promise(function(resolve,reject){
            UserRepository.Update_pass(otp,password).then(users=>{
                if(users == null){
                    resolve(null);
                }else{
                    resolve(users['dataValues']);
                }

            },error=>{
                reject(error);
            });
        });
    },
    resend_user:function(token){
        return new Promise(function(resolve,reject){
            UserRepository.Resend_otp(token).then(users=>{
                if(users == null){
                    resolve(null);
                }else{
                    resolve(users['dataValues']);
                }

            },error=>{
                reject(error);
            });
        });
    },
    update_profile:function(token,first_name,last_name,address,phone,picture,lattitude,longitude,company_name){
        return new Promise(function(resolve,reject){
            UserRepository.Update_profile(token,first_name,last_name,address,phone,picture,lattitude,longitude,company_name).then(users=>{
                if(users == null){
                    resolve(null);
                }else{
                    resolve(users['dataValues']);
                }

            },error=>{
                reject(error);
            });
        });
    },
    logout:function(){
        console.log("Invalidate token.");
    },
    get_user:function(token){
        return new Promise(function(resolve,reject){
            UserRepository.Get_user(token).then(users=>{
                if(users == null){
                    resolve(null);
                }else{
                    resolve(users['dataValues']);
                }

            },error=>{
                reject(error);
            });
        });
    },
};
module.exports=service;