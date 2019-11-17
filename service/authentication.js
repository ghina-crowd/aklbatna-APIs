var models=require('../models/models.js');
var countryRepository=require('../repository/country.js');
var fields=require('../constant/field.js');
var service={
    login:function(email,password){
        return new Promise(function(resolve,reject){
            countryRepository.Login(email,password).then(users=>{
                if(users == null){
                    resolve(users['dataValues']);
                }else{
                    resolve(users['dataValues']);
                }

            },error=>{
                reject(error);
            });
        });
    },
    login_token:function(id,token){
        return new Promise(function(resolve,reject){
            countryRepository.Login_Token(id,token).then(users=>{
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
    check_user:function(email){
        return new Promise(function(resolve,reject){
            countryRepository.Check(email).then(users=>{
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
            countryRepository.Register(email,password,first_name,last_name,phone,user_type).then(users=>{

                resolve(users['dataValues']);

            },error=>{
                reject(error);
            });
        });
    },
    check_otp:function(token,otp){
        return new Promise(function(resolve,reject){
            countryRepository.Check_otp(token,otp).then(users=>{
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
            countryRepository.Check_token(token).then(users=>{
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
            countryRepository.Activate(token,otp).then(users=>{
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
            countryRepository.Change_pass(token,password).then(users=>{
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
            countryRepository.Update_profile(token,first_name,last_name,address,phone,picture,lattitude,longitude,company_name).then(users=>{
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
            countryRepository.Get_user(token).then(users=>{
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