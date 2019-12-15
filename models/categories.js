
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('shop_category', {
        shop_category_id: {
            type: DataTypes.STRING(225),
            primaryKey: true,
            autoIncrement: true
        },
        name_en: {
            type: DataTypes.STRING(225),
        },
        name_ar: {
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
        icon: {
            type: DataTypes.STRING(225),
        },
        timestamp_create: {
            type: DataTypes.STRING(225),
        },
    }, {
        tableName: 'shop_category'
    });
};
