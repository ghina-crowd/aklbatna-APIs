var {sequelize,Sequelize}=require('../util/db.js');
var shop_sub_category=require('./sub_categories.js');
module.exports={
    SubCategory:shop_sub_category(sequelize,Sequelize),
};