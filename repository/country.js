var models=require('../models/models.js');
var fields=require('../constant/field.js');
var commonRepository=require('./common.js');
var CountryRepository={
    FindAllByDeleted:function(deleted){
        return new Promise(function(resolve,reject){
            models.Country.findAll({where:{deleted:deleted}}).then(existingCountries=>{
                resolve(existingCountries);
            },error=>{
                reject(error);
            }); 
        });
    },
    FindByIdAndDeleted:function(id,deleted){
        return new Promise(function(resolve,reject){
            models.Country.findOne({where:{pk_country_id:id,deleted:deleted}}).then(existingCountries=>{
                resolve(existingCountries);
            },error=>{
                reject(error);
            }); 
        });
    },
    Login:function(email,password){
        return new Promise(function(resolve,reject){
            models.Country.findOne({attributes: ['user_admin_id','name','email','phone','first_name','last_name','active'], where:{email:email,password:password}}).then(users=>{
                resolve(users);
            },error=>{
                reject(error);
            });
        });
    },
    Login_Token:function(id,token){
        return new Promise(function(resolve,reject){

            console.log(id,token);
                    models.Country.update({session_id:token}, {where:{user_admin_id:id}}).then(function(result){
                        resolve(result);
                        console.log(result);
                    },function(error){
                    },function(error){
                        reject(error);
                    });


        });
    },
    Check:function(email){
        return new Promise(function(resolve,reject){
            models.Country.findOne({attributes: ['user_admin_id'], where:{email:email}}).then(users=>{
                resolve(users);

                return users;
            },error=>{
                reject(error);
            });
        });
    },
    Register:function(email,password,first_name,last_name,phone,user_type){
        return new Promise(function(resolve,reject){
            var otp_val = Math.floor(1000 + Math.random() * 9000);

            models.Country.create({email:email, password:password, first_name:first_name, last_name:last_name, phone:phone, otp:otp_val,user_type:user_type}).then(users=>{
                resolve(users);
            },error=>{
                reject(error)
            });
        });
    },
    Check_otp:function(token,otp){
        return new Promise(function(resolve,reject){
            models.Country.findOne({attributes: ['otp'], where:{session_id:token,otp:otp}}).then(users=>{
                resolve(users);
            },error=>{
                reject(error);
            });
        });
    },
    Check_token:function(token){
        return new Promise(function(resolve,reject){
            models.Country.findOne({attributes: ['session_id'], where:{session_id:token}}).then(users=>{
                resolve(users);
            },error=>{
                reject(error);
            });
        });
    },
    Activate:function(token,otp){
        return new Promise(function(resolve,reject){
            models.Country.update({active:1}, {where:{session_id:token}}).then(function(result){
                resolve(result);
            },function(error){
            },function(error){
                reject(error);
            });
        });
    },
    Change_pass:function(token,password){
        return new Promise(function(resolve,reject){
            models.Country.update({password:password}, {where:{session_id:token}}).then(function(result){
                resolve(result);
            },function(error){
            },function(error){
                reject(error);
            });
        });
    },
    Update_profile:function(token,first_name,last_name,address,phone,picture,lattitude,longitude,company_name){
        return new Promise(function(resolve,reject){
            models.Country.update({first_name:first_name,last_name:last_name,address:address,phone:phone,picture:picture,lattitude:lattitude,longitude:longitude,company_name:company_name}, {where:{session_id:token}}).then(function(result){
                resolve(result);
            },function(error){
            },function(error){
                reject(error);
            });
        });
    },
    Get_user:function(token){
        return new Promise(function(resolve,reject){
            models.Country.findOne({attributes: ['user_admin_id','email','first_name','last_name','address','phone','picture','lattitude','longitude','company_name'], where:{session_id:token}}).then(users=>{
                resolve(users);
            },error=>{
                reject(error);
            });
        });
    },
};
Object.assign(CountryRepository,commonRepository);
module.exports=CountryRepository;