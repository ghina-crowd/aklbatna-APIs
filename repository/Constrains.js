var models = require('../models/models.js');
var commonRepository = require('./common.js');
var lang = require('../app');
var constrains;

var constrainsRepository = {

    getConstrains: function () {
        return new Promise(function (resolve, reject) {
            models.Constraints.findOne().then((constrains => {
                if (constrains == null) {
                    resolve(null);
                } else {
                    resolve(constrains);
                }
            }), error => {
                reject(error);
            })
        });
    },

    updateConstrains: function (newconstrainsData) {
        return new Promise(function (resolve, reject) {
            models.Constraints.update({
                max_percentage: newconstrainsData.max_percentage,
            },{ where: {}}).then(constrains => {
                models.Constraints.findOne().then((constrains => {
                    if (constrains == null) {
                        resolve({});
                    } else {
                        resolve(constrains);
                    }
                }), error => {
                    reject(error);
                })
            }, error => {
                reject(error)
            });
        });
    },

};
Object.assign(constrainsRepository, commonRepository);
module.exports = constrainsRepository;