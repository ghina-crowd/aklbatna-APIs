
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('deals', {
        deal_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.STRING(225),
        },
        sub_category_id: {
            type: DataTypes.STRING(225),
            foreignKey: true
        },
        shop_category_id: {
            type: DataTypes.STRING(225),
            foreignKey: true
        },
        deal_title_en: {
            type: DataTypes.STRING(225),
        },
        deal_title_ar: {
            type: DataTypes.STRING(225),
        },
        company_id: {
            type: DataTypes.STRING(225),
            foreignKey: true,
        },
        branch_id: {
            type: DataTypes.STRING(225),
            foreignKey: true,
        },
        short_detail: {
            type: DataTypes.STRING(225),
        },
        details_en: {
            type: DataTypes.STRING(225),
        },
        details_ar: {
            type: DataTypes.STRING(225),
        },
        pre_price: {
            type: DataTypes.STRING(225),
        },
        new_price: {
            type: DataTypes.STRING(225),
        },
        start_time: {
            type: DataTypes.STRING(225),
        },
        end_time: {
            type: DataTypes.STRING(225),
        },
        active: {
            type: DataTypes.STRING(225),
        },
        premium: {
            type: DataTypes.STRING(225),
        },
        location_address: {
            type: DataTypes.STRING(225),
        },
        final_rate: {
            type: DataTypes.FLOAT,
        },
        count_bought: {
            type: DataTypes.INTEGER,
        },
        main_image: {
            type: DataTypes.STRING,
        },

    }, {
        tableName: 'deals'
    });
};
