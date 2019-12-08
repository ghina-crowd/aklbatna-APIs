
var {sequelize,Sequelize} = require('../util/db.js');
var sub_deals = require('./sub_deals.js');
module.exports={
    SubDeals: sub_deals(sequelize,Sequelize),
};

