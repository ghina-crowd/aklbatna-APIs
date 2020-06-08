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
var city = require('./City');
var subscribe = require('./subscribe');
var address = require('./Address');
var accounts = require('./Account');
var order = require('./Order');
var suborder = require('./SubOrder');
var offers = require('./Offers');
var subscription = require('./Subscription');
var profit = require('./Profit');
var notifications = require('./Notifications');
var constraints = require('./Constraints');



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
    Subscribe: subscribe(sequelize, Sequelize),
    City: city(sequelize, Sequelize),
    Address: address(sequelize, Sequelize),
    Accounts: accounts(sequelize, Sequelize),
    Order: order(sequelize, Sequelize),
    SubOrder: suborder(sequelize, Sequelize),
    Offers: offers(sequelize, Sequelize),
    Subscription: subscription(sequelize, Sequelize),
    Profit: profit(sequelize, Sequelize),
    Notifications: notifications(sequelize, Sequelize),
    Constraints: constraints(sequelize, Sequelize),

};