
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('deals', {
        deal_id: {
            type: DataTypes.STRING(225),
        },
        user_id: {
            type: DataTypes.STRING(225),
        },
        sub_category_id: {
            type: DataTypes.STRING(225),
        },
        deal_title: {
            type: DataTypes.STRING(225),
        },
        lattitude: {
            type: DataTypes.STRING(225),
        },
        longitude: {
            type: DataTypes.STRING(225),
        },
        company_name: {
            type: DataTypes.STRING(225),
        },
        short_detail: {
            type: DataTypes.STRING(225),
        },
        details: {
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

    }, {
        tableName: 'deals'
    });
};
