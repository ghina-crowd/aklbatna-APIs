
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('shop_sub_category', {
        shop_sub_category_id: {
            type: DataTypes.STRING(225),
        },
        shop_category_id: {
            type: DataTypes.STRING(225),
        },
        sub_name: {
            type: DataTypes.STRING(225),
        },
        short_details: {
            type: DataTypes.STRING(225),
        },
        created_time: {
            type: DataTypes.STRING(225),
        },

    }, {
        tableName: 'shop_sub_category'
    });
};
