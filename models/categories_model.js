var {sequelize,Sequelize}=require('../util/db.js');
var shop_category=require('./categories.js');
module.exports={
    Category:shop_category(sequelize,Sequelize),
};