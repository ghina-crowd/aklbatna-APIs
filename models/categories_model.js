
var {sequelize,Sequelize}=require('../util/db.js');
var shop_category=require('./categories.js');
module.exports={
    Categories:shop_category(sequelize,Sequelize),
};