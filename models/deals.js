
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

        attache_link: {
            type: DataTypes.STRING(225),
        },
        attache: {
            type: DataTypes.STRING(225)
        },
        deal_Inclusions: {
            type: DataTypes.TEXT,
        },
        deal_Inclusions_link: {
            type: DataTypes.STRING(225)
        },
        deal_exclusions: {
            type: DataTypes.TEXT,
        },
        deal_exclusions_link: {
            type: DataTypes.STRING(225)
        },


        branch_id: {
            type: DataTypes.STRING(225),
            foreignKey: true,
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
        terms_and_conditions: {
            type: DataTypes.TEXT,
        },
        purchased_voucher: {
            type: DataTypes.STRING(225),
        },
        link_for_booking: {
            type: DataTypes.STRING(225),
        },
        is_prior_booking: {
            type: DataTypes.INTEGER,
        },
        prior_booking_message: {
            type: DataTypes.TEXT,
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
