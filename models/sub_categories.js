
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('shop_sub_category', {
        sub_category_id: {
            type: DataTypes.STRING(225),
            primaryKey: true,
            autoIncrement: true
        },
        shop_category_id: {
            type: DataTypes.STRING(225),
        },
        sub_name_en: {
            type: DataTypes.STRING(225),
        },
        sub_name_ar: {
            type: DataTypes.STRING(225),
        },
        short_details: {
            type: DataTypes.STRING(225),
        },
        created_time: {
            type: DataTypes.STRING(225),
        },
        active: {
            type: DataTypes.STRING(225),
        },

    }, {
        tableName: 'shop_sub_category'
    });
};
