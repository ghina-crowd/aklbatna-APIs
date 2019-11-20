var models=require('../models/models.js');
var subcategoryRepository=require('../repository/sub_categories.js');
var fields=require('../constant/field.js');
var service={
    get_pro_categories:function(){
        return new Promise(function(resolve,reject){
            subcategoryRepository.Get_categories_products().then(categories=>{
                resolve(categories);
            },error=>{
                reject(error);
            });
        });
    },
    get_sub_categories:function(){
        return new Promise(function(resolve,reject){
            subcategoryRepository.Get_sub_categories().then(categories=>{
                resolve(categories);
            },error=>{
                reject(error);
            });
        });
    },
};
module.exports=service;