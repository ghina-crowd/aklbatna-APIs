var {sequelize,Sequelize}=require('../util/db.js');
var company = require('./company.js');
module.exports={
    Company:company(sequelize,Sequelize),
};