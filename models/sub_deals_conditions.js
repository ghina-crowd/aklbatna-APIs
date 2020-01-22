
var { sequelize, Sequelize } = require('../util/db.js');
var conditions_deals = require('./conditions_deals');
module.exports = {
    ConditionsDeals: conditions_deals(sequelize, Sequelize),
};

