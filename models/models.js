var {sequelize,Sequelize}=require('../util/db.js');
var user_admin=require('./users.js');
module.exports={
    Country:user_admin(sequelize,Sequelize),
};