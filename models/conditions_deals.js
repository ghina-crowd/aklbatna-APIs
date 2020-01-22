
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('deals_condition', {
        condition_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        deal_id: {
            type: DataTypes.INTEGER,
        },
        details_en: {
            type: DataTypes.TEXT
        },
        details_ar: {
            type: DataTypes.TEXT
        }

    }, {
        tableName: 'deals_condition'
    });
};
