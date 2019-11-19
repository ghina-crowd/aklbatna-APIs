
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('shop_product', {
        shop_product_id: {
            type: DataTypes.STRING(45),
        },
        sales_id: {
            type: DataTypes.STRING(45),
        },
        vendor_id: {
            type: DataTypes.STRING(45),
        },
        shop_category_id: {
            type: DataTypes.STRING(45),
        },
        product_name: {
            type: DataTypes.STRING(45),
        },

    }, {
        tableName: 'shop_product'
    });
};
