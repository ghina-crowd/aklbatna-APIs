var models = require('../models/sub_categories_model.js');
var deals_model = require('../models/deals_model.js');
var category_model = require('../models/categories_model.js');
var fields = require('../constant/field.js');
var commonRepository = require('./common.js');
var ars = require('array-merge-by-key');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var SubCategoryRepository = {
    Get_sub_categories: function () {
        return new Promise(function (resolve, reject) {
            models.SubCategory.findAll({where: {active: 1}}).then(categories => {
                if (categories == null) {
                    resolve(null);
                } else {
                    resolve(categories);
                }
            }, error => {
                reject(error);
            });
        });
    },
    Get_categories_products: function () {
        return new Promise(function (resolve, reject) {

            models.SubCategory.belongsTo(category_model.Categories, {targetKey:'shop_category_id',foreignKey: 'shop_category_id'});
            models.SubCategory.findAll({attributes: ['sub_category_id','shop_category_id']},{include: [{model: category_model.Categories}]}).then(subcategories => {


                         deals_model.Deals.findAll({attributes: ['deal_id', 'user_id', 'sub_category_id', 'deal_title', 'lattitude', 'longitude', 'company_name', 'short_detail', 'details', 'pre_price', 'new_price', 'start_time', 'end_time', 'active', 'premium', 'location_address']},{where: {active: 1}}).then(deals => {
                             var dealsArray = [];
                             subcategories.forEach(item =>{
                                 deals.forEach(deal =>{
                                     if( deal.dataValues.sub_category_id === item.dataValues.sub_category_id){
                                         dealsArray.push(deal.dataValues);
                                     }
                                 })
                                 item.dataValues['deals'] =  dealsArray;
                             })
                             resolve(subcategories);
                         });

                    }, error => {
                        reject(error);
                    });

            /*deals_model.Deals.findAll({attributes: ['deal_id', 'user_id', 'sub_category_id', 'deal_title', 'lattitude', 'longitude', 'company_name', 'short_detail', 'details', 'pre_price', 'new_price', 'start_time', 'end_time', 'active', 'premium', 'location_address']},{where: {active: 1}}).then(deals => {
                                      if (deals == null) {
                                          resolve(null);
                                      } else {

                                          var result = ars.mergeByKey("sub_category_id", deals, subcategories);

                                          resolve(result);

                                          /!*var dealsArray = [];
                                          subcategories.forEach(item =>{
                                              deals.forEach(deal =>{
                                                  if( deal.dataValues.category_id == item.dataValues.shop_sub_category_id){
                                                      dealsArray.push(deal.dataValues);
                                                  }

                                              })

                                              item.dataValues['deals'] =  dealsArray;
                                          })

                                          resolve(subcategories);*!/

                                         /!* var outArr = [];
                                          deals.forEach(function(value) {
                                              var existing = subcategories.filter(function(v, i) {
                                                  return (v.dataValues.sub_category_id == value.dataValues.sub_category_id);
                                              });
                                              if (existing.length) {
                                                  value.type = existing[0].type;
                                                  outArr.push(value)
                                              } else {
                                                  value.type = '';
                                                  outArr.push(value);
                                              }
                                          });
                                          console.log(outArr)*!/

                                         /!* var json3 = deals.concat(subcategories).reduce(function(index, obj) {
                                              if (!index[obj.dataValues.sub_category_id]) {
                                                  index[obj.dataValues.sub_category_id] = obj;
                                              } else {
                                                  for (prop in obj) {
                                                      index[obj.dataValues.sub_category_id][prop] = obj[prop];
                                                  }
                                              }
                                              return index;
                                          }, []).filter(function(res, obj) {
                                              return obj;
                                          });
                                          resolve(json3);*!/


                                         /!* var val = subcategories.map(x => Object.assign(x, deals.find(y => y.dataValues.sub_category_id == x.dataValues.sub_category_id)));
                                          console.log(val);
                                          resolve(val);*!/
                                          /!*category_model.Categories.findAll({where: {active: 1}}).then(categories => {
                                              var mainArray = [];
                                              categories.forEach(item =>{
                                                  categories.forEach(categories =>{
                                                      if( categories.dataValues.shop_category_id == item.dataValues.shop_category_id){
                                                          mainArray.push(categories.dataValues);
                                                      }
                                                  })

                                                  item.dataValues['category'] =  mainArray;
                                              })
                                              resolve(subcategories);
                                          })*!/



                                      }
                                  }, error => {
                                      reject(error);
                                  });*/

            /*   category_model.Categories.findAll({attributes: ["shop_category_id","name","short_desc","active","arrange","timestamp_create", "timestamp_update"]},{where: {active: 1}}).then(categories => {

                       var myArray = [];
                   subcategories.forEach(item =>{
                       categories.forEach(data =>{
                               if( data.dataValues['shop_category_id'] == item.dataValues['shop_category_id']){
                                   myArray.push(data.dataValues);
                               }
                           })
                           item.dataValues['category'] =  myArray;

                       })

                   resolve(subcategories);

                   }, error => {
                       reject(error);
                   });*/

            /* deals_model.Deals.findAll({where: {active: 1}, order:[["shop_deal_id","DESC"]], limit : 4}).then(deals => {
                        if (deals == null) {
                            resolve(null);
                        } else {
                            var dealsArray = [];
                             subcategories.forEach(item =>{
                                 deals.forEach(deal =>{
                                   if( deal.dataValues.shop_sub_category_id == item.dataValues.shop_sub_category_id){
                                       dealsArray.push(deal.dataValues);
                                   }
                                 })

                                 item.dataValues['deals'] =  dealsArray;
                             })

                            category_model.Categories.findAll({where: {active: 1}}).then(categories => {
                                var mainArray = [];
                                categories.forEach(item =>{
                                    categories.forEach(categories =>{
                                        if( categories.dataValues.shop_category_id == item.dataValues.shop_category_id){
                                            mainArray.push(categories.dataValues);
                                        }
                                    })

                                    item.dataValues['category'] =  mainArray;
                                })
                                resolve(subcategories);
                            })



                        }
                    }, error => {
                        reject(error);
                    });*/

        });
    },
};
Object.assign(SubCategoryRepository, commonRepository);
module.exports = SubCategoryRepository;