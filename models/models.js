var { sequelize, Sequelize } = require('../util/db.js');
var user_admin = require('./users.js');
var account = require('./account.js');
var purchase = require('./account.js');
module.exports = {
    User: user_admin(sequelize, Sequelize),
    Account: account(sequelize, Sequelize),
    Purchase: purchase(sequelize, Sequelize),
};