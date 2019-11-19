var models=require('../models/models.js');
var fields=require('../constant/field.js');
var commonRepository=require('./common.js');
var UserRepository={
    FindAllByDeleted:function(deleted){
        return new Promise(function(resolve,reject){
            models.User.findAll({where:{deleted:deleted}}).then(existingCountries=>{
                resolve(existingCountries);
            },error=>{
                reject(error);
            }); 
        });
    },
    FindByIdAndDeleted:function(id,deleted){
        return new Promise(function(resolve,reject){
            models.User.findOne({where:{pk_User_id:id,deleted:deleted}}).then(existingCountries=>{
                resolve(existingCountries);
            },error=>{
                reject(error);
            }); 
        });
    },
    Login:function(email,password){
        return new Promise(function(resolve,reject){
            models.User.findOne({attributes: ['user_admin_id','name','email','phone','first_name','last_name','active'], where:{email:email,password:password}}).then(users=>{
                resolve(users);
            },error=>{
                reject(error);
            });
        });
    },
    Check_email:function(email){
        return new Promise(function(resolve,reject){
            models.User.findOne({attributes: ['email'], where:{email:email}}).then(users=>{
                resolve(users['dataValues']);
                return users['dataValues'];
            },error=>{
                reject(error);
            });
        });
    },
    Login_Token:function(id,token){
        return new Promise(function(resolve,reject){

            console.log(id,token);
                    models.User.update({session_id:token}, {where:{user_admin_id:id}}).then(function(result){
                        resolve(result);
                    },function(error){
                        reject(error);
                    });


        });
    },
    Update_otp:function(email){
        return new Promise(function(resolve,reject){
            var otp_val = Math.floor(1000 + Math.random() * 9000);
            models.User.update({otp:otp_val}, {where:{email:email}}).then(function(result){
                models.User.findOne({attributes: ['otp','email'], where:{email:email}}).then(users=>{
                    resolve(users);
                },error=>{
                    reject(error);
                });
            },function(error){
                reject(error);
            });


        });
    },
    Check:function(email,password,first_name,last_name,phone,user_type){
        return new Promise(function(resolve,reject){
            models.User.findOne({attributes: ['user_admin_id'], where:{email:email}}).then(users=>{
                if(users == null){
                    var otp_val = Math.floor(1000 + Math.random() * 9000);
                    models.User.create({email:email, password:password, first_name:first_name, last_name:last_name, phone:phone, otp:otp_val,user_type:user_type}).then(users=>{
                        resolve(users);
                    },error=>{
                        reject(error)
                    });
                }else{
                    resolve(null)
                }
            },error=>{
                reject(error);
            });
        });
    },
    Check_otp:function(token,otp){
        return new Promise(function(resolve,reject){
            models.User.findOne({attributes: ['otp','email'], where:{session_id:token,otp:otp}}).then(users=>{
                resolve(users);
            },error=>{
                reject(error);
            });
        });
    },
    Check_token:function(token){
        return new Promise(function(resolve,reject){
            models.User.findOne({attributes: ['session_id'], where:{session_id:token}}).then(users=>{
                resolve(users);
            },error=>{
                reject(error);
            });
        });
    },
    Activate:function(token,otp){
        return new Promise(function(resolve,reject){
            models.User.update({active:1}, {where:{session_id:token}}).then(function(result){
                resolve(result);
            },function(error){
            },function(error){
                reject(error);
            });
        });
    },
    Change_pass:function(token,password){
        return new Promise(function(resolve,reject){
            models.User.update({password:password}, {where:{session_id:token}}).then(function(result){
                resolve(result);
            },function(error){
            },function(error){
                reject(error);
            });
        });
    },
    Update_pass:function(otp,password){
        return new Promise(function(resolve,reject){
            models.User.update({password:password}, {where:{otp:otp}}).then(function(result){

                models.User.findOne({attributes: ['otp'], where:{otp:otp}}).then(results=>{
                    resolve(results);
                },error=>{
                    reject(error);
                });

            },function(error){
                reject(error);
            });
        });
    },
    Resend_otp:function(token){
        return new Promise(function(resolve,reject){
            var otp_val = Math.floor(1000 + Math.random() * 9000);
            models.User.update({otp:otp_val}, {where:{session_id:token}}).then(function(result){
                models.User.findOne({attributes: ['otp','email'], where:{session_id:token}}).then(users=>{
                    resolve(users);
                },error=>{
                    reject(error);
                });
            },function(error){
                reject(error);
            });
        });
    },
    Update_profile:function(token,first_name,last_name,address,phone,picture,lattitude,longitude,company_name){
        return new Promise(function(resolve,reject){
            models.User.update({first_name:first_name,last_name:last_name,address:address,phone:phone,picture:picture,lattitude:lattitude,longitude:longitude,company_name:company_name}, {where:{session_id:token}}).then(function(result){
                resolve(result);
            },function(error){
            },function(error){
                reject(error);
            });
        });
    },
    Get_user:function(token){
        return new Promise(function(resolve,reject){
            models.User.findOne({attributes: ['user_admin_id','email','first_name','last_name','address','phone','picture','lattitude','longitude','company_name','company_name_arabic'], where:{session_id:token}}).then(users=>{
                resolve(users);
            },error=>{
                reject(error);
            });
        });
    },
};
Object.assign(UserRepository,commonRepository);
module.exports=UserRepository;