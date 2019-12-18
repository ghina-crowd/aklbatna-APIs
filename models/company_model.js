var {sequelize,Sequelize}=require('../util/db.js');
var company = require('./company.js');
var company_branches = require('./company_branches');
module.exports={
    Company:company(sequelize,Sequelize),
    Company_Branches:company_branches(sequelize,Sequelize),
};