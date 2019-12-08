
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('sub_deals', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        deal_id: {
            type: DataTypes.INTEGER,
        },
        title_en: {
            type: DataTypes.STRING(225),
        },
        title_ar: {
            type: DataTypes.STRING(225),
        },
        pre_price: {
            type: DataTypes.INTEGER,
        },
        new_price: {
            type: DataTypes.INTEGER,
        },

    }, {
        tableName: 'sub_deals'
    });
};
