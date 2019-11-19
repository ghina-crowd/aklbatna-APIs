var {sequelize,Sequelize}=require('../util/db.js');
var user_admin=require('./users.js');
module.exports={
    User:user_admin(sequelize,Sequelize),
};