var models = require('../models/categories_model.js');
var deals_model = require('../models/deals_model.js');
var fields = require('../constant/field.js');
var commonRepository = require('./common.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var CategoryRepository = {

};
Object.assign(CategoryRepository, commonRepository);
module.exports = CategoryRepository;