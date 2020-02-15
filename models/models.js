var { sequelize, Sequelize } = require('../util/db.js');
var users = require('./users.js');
var kitchens = require('./Kitchen');
var categories = require('./Category');
var meals = require('./Meals');
var menu = require('./Menu');
var reviews = require('./Reviews');
var banners = require('./Banners');
var contact = require('./Contact');
var favourite = require('./Favourite');
var types = require('./Type');

module.exports = {
    User: users(sequelize, Sequelize),
    kitchens: kitchens(sequelize, Sequelize),
    Categories: categories(sequelize, Sequelize),
    Meals: meals(sequelize, Sequelize),
    Menu: menu(sequelize, Sequelize),
    Reviews: reviews(sequelize, Sequelize),
    Banners: banners(sequelize, Sequelize),
    Contact: contact(sequelize, Sequelize),
    Favourite: favourite(sequelize, Sequelize),
    Type: types(sequelize, Sequelize),

};