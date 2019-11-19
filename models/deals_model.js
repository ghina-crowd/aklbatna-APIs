var {sequelize,Sequelize}=require('../util/db.js');
var shop_product=require('./deals.js');
module.exports={
    Deals:shop_product(sequelize,Sequelize),
};