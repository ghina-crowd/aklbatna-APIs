var models=require('../models/models.js');
var countryRepository=require('../repository/country.js');
var fields=require('../constant/field.js');
var service={
    login:function(email,password){
        return new Promise(function(resolve,reject){
            countryRepository.Login(email,password).then(users=>{
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
    register_user:function(email,password,first_name,last_name,phone){
        return new Promise(function(resolve,reject){
            countryRepository.Register(email,password,first_name,last_name,phone).then(users=>{
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
    check_otp:function(user_id,otp){
        return new Promise(function(resolve,reject){
            countryRepository.Check_otp(user_id,otp).then(users=>{
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
    activate_user:function(user_id,otp){
        return new Promise(function(resolve,reject){
            countryRepository.Activate(user_id,otp).then(users=>{
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
    }
};
module.exports=service;