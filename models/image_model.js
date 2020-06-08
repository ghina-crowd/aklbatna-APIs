var {sequelize,Sequelize}=require('../util/db.js');
var images=require('./images.js');
module.exports={
    Images:images(sequelize,Sequelize),
};