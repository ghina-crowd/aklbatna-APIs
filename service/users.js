var UserRepository=require('../repository/users.js');
var fields=require('../constant/field.js');
var models=require('../models/models.js');
module.exports={
    GetAllUser:function(){
        return new Promise(function(resolve,reject){
            UserRepository.FindAllByDeleted(false).then(existingCountries=>{
                var countries=[];
                existingCountries.forEach(existingUser => {
                    var User={};
                    User[fields.ID]=existingUser.pk_User_id;
                    User[fields.NAME]=existingUser.name;
                    User[fields.SHORT_NAME]=existingUser.short_name;
                    User[fields.MOBILE_CODE]=existingUser.mobile_code;
                    countries.push(User);
                });
                resolve(countries);
            },error=>{
                reject(error);
            }); 
        });
    },
    GetUser:function(id){
        return new Promise(function(resolve,reject){
            UserRepository.FindByIdAndDeleted(id,false).then(existingUser=>{
                var User;
                if(existingUser){
                    User={};
                    User[fields.ID]=existingUser.pk_User_id;
                    User[fields.NAME]=existingUser.name;
                    User[fields.SHORT_NAME]=existingUser.short_name;
                    User[fields.MOBILE_CODE]=existingUser.mobile_code;
                }
                resolve(User);
            },error=>{
                reject(error);
            }); 
        });
    },
    Create:function(newUserData){
        return new Promise(function(resolve,reject){
            var newUserModel={};
            newUserModel[fields.NAME]=newUserData.name;
            newUserModel[fields.SHORT_NAME]=newUserData.short_name;
            newUserModel[fields.MOBILE_CODE]=newUserData.mobile_code;
            newUserModel[fields.DELETED]=false;
            var newUser=models.User.build(newUserModel);
            UserRepository.Save(newUser).then(function(result){
                resolve(result);
            },function(error){
                reject(error);
            }); 
        });
    },
    Login:function(data){
        return new Promise(function(resolve,reject){
            UserRepository.Login(data.email,data.password).then(existinguser=>{
                resolve(existinguser);
                return existinguser;
            },error=>{
                reject(error);
            });
        });
    },
    Update:function(id,UserData){
        return new Promise(function(resolve,reject){
            UserRepository.FindByIdAndDeleted(id,false).then(existingUser=>{
                var User;
                if(existingUser){
                    existingUser[fields.NAME]=UserData[fields.NAME];
                    existingUser[fields.SHORT_NAME]=UserData[fields.SHORT_NAME];
                    existingUser[fields.MOBILE_CODE]=UserData[fields.MOBILE_CODE];
                    UserRepository.Save(existingUser).then(function(result){
                        resolve(result);
                    },function(error){
                        reject(error);
                    });
                }
            },error=>{
                reject(error);
            }); 
        });
    }
};