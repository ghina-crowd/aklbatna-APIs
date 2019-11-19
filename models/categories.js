
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('shop_category', {
        shop_category_id: {
            type: DataTypes.STRING(45),
        },
        shop_category_main_id: {
            type: DataTypes.STRING(45),
        },
        name: {
            type: DataTypes.STRING(45),
        },
        short_desc: {
            type: DataTypes.STRING(45),
        },
        arrange: {
            type: DataTypes.STRING(45),
        },

    }, {
        tableName: 'shop_category'
    });
};
