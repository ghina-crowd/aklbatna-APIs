
var { sequelize, Sequelize } = require('../util/db.js');
var info_deals = require('./info_deals');
module.exports = {
    InfoDeals: info_deals(sequelize, Sequelize),
};

