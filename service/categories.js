var models=require('../models/models.js');
var categoryRepository=require('../repository/categories.js');
var fields=require('../constant/field.js');
var service={
    get_categories:function(){
        return new Promise(function(resolve,reject){
            categoryRepository.Get_categories().then(categories=>{
                    resolve(categories);

            },error=>{
                reject(error);
            });
        });
    },
};
module.exports=service;