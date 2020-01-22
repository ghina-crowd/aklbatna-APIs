var { sequelize, Sequelize } = require('../util/db.js');
var user_admin = require('./users.js');
var activities = require('./activities');
var account = require('./account.js');
var purchase = require('./purchase');
var advertising = require('./advertising');
var contactus = require('./contactus');
var requests = require('./requests');
var cities = require('./city');
var coboney = require('./coboney');

module.exports = {
    User: user_admin(sequelize, Sequelize),
    Account: account(sequelize, Sequelize),
    Purchase: purchase(sequelize, Sequelize),
    Advertising: advertising(sequelize, Sequelize),
    Activities: activities(sequelize, Sequelize),
    ContactUs: contactus(sequelize, Sequelize),
    Requests: requests(sequelize, Sequelize),
    Cities: cities(sequelize, Sequelize),
    Coboney: coboney(sequelize, Sequelize),
};