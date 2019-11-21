var models=require('../models/categories_model.js');
var deals_model=require('../models/deals_model.js');
var fields=require('../constant/field.js');
var commonRepository=require('./common.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var CategoryRepository={
    Get_categories:function(){
        return new Promise(function(resolve,reject){
            models.Category.findAll({attributes: ['shop_category_id','shop_category_main_id','name','short_desc','arrange'], where:{active:1,shop_category_main_id:0}}).then(categories=>{
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
    Get_sub_categories:function(){
        return new Promise(function(resolve,reject){
            models.Category.findAll({attributes: ['shop_category_id','shop_category_main_id','name','short_desc','arrange'], where:{active:1,shop_category_main_id:{[Op.ne]: 0}}}).then(categories=>{
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
    Get_categories_products:function(){
        return new Promise(function(resolve,reject){
            models.Category.findAll({attributes: ['shop_category_id','shop_category_main_id','name','short_desc','arrange'], where:{active:1}}).then(categories=>{
                if(categories == null){
                    resolve(null);
                }else {

                    deals_model.Deals.findAll({attributes: ['shop_category_id','shop_product_id','vendor_id','sales_id'], where:{active:1}}).then(products=>{
                        if(products == null){
                            resolve(null);
                        }else {
                            hash = Object.create(null),
                                result = a.map(function (a, i) {
                                    hash[a.id] = { id: a.id, name: a.name };
                                    return hash[a.id];
                                }, hash);

                            b.forEach(function (a) {
                                hash[a.sub].map = hash[a.sub].map || [];
                                hash[a.sub].map.push({ id: a.id, name: a.name });
                            }, hash);

                            console.log(result);

                        }
                    },error=>{
                        reject(error);
                    });

                }
            },error=>{
                reject(error);
            });
           /* models.Category.belongsTo(deals_model.Deals, {targetKey:'shop_category_id',foreignKey: 'shop_category_id'});
            models.Category.findAll({
                include: [{
                    model: deals_model.Deals,
                    where: {
                        active: 1,
                    },
                }]
            }, {wherwe:{active:1}}, {limit: 4}).then(categories=>{
                if(categories == null){
                    resolve(null);
                }else {
                    resolve(categories);

                }
            },error=>{
                reject(error);
            });*/
        });
    },
};
Object.assign(CategoryRepository,commonRepository);
module.exports=CategoryRepository;