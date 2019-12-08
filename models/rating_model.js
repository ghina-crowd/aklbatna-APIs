
var {sequelize,Sequelize} = require('../util/db.js');
var rating = require('./rating.js');
module.exports={
    Rating: rating(sequelize,Sequelize),
};

