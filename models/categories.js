
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('shop_category', {
        sub_category_id: {
            type: DataTypes.STRING(225),
        },
        name: {
            type: DataTypes.STRING(225),
        },
        url_rewrite: {
            type: DataTypes.STRING(225),
        },
        keyword: {
            type: DataTypes.STRING(225),
        },
        short_desc: {
            type: DataTypes.STRING(225),
        },
        active: {
            type: DataTypes.STRING(225),
        },
        arrange: {
            type: DataTypes.STRING(225),
        },
        lang_iso: {
            type: DataTypes.STRING(225),
        },
        timestamp_create: {
            type: DataTypes.STRING(225),
        },
        timestamp_update: {
            type: DataTypes.STRING(225),
        },
    }, {
        tableName: 'shop_category'
    });
};