var models=require('../models/categories_model.js');
var fields=require('../constant/field.js');
var commonRepository=require('./common.js');
var CategoryRepository={
    Get_categories:function(){
        return new Promise(function(resolve,reject){
            models.Category.findAll({attributes: ['shop_category_id','shop_category_main_id','name','short_desc','arrange'], where:{active:1}}).then(categories=>{
                if(categories == null){
                    resolve(null);
                }else {
                    resolve(categories);
                }
            },error=>{
                reject(error);
            });
        });
    },
};
Object.assign(CategoryRepository,commonRepository);
module.exports=CategoryRepository;