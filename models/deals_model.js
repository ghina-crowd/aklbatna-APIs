var {sequelize,Sequelize}=require('../util/db.js');
var deals=require('./deals.js');
module.exports={
    Deals:deals(sequelize,Sequelize),
};