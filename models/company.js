
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('companies', {
        company_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        company_name_en: {
            type: DataTypes.STRING(225),
        },
        company_name_ar: {
            type: DataTypes.STRING(225),
        },
        description_en: {
            type: DataTypes.STRING(1000),
        },
        description_ar: {
            type: DataTypes.STRING(1000),
        },
        latitude: {
            type: DataTypes.STRING(225),
        },
        longitude: {
            type: DataTypes.STRING(225),
        },
        location_name: {
            type: DataTypes.STRING(225),
        },
        icon: {
            type: DataTypes.STRING(225),
        },
        company_role: {
            type: DataTypes.STRING(225),
        },
        landline_number: {
            type: DataTypes.STRING(225),
        },
        trade_name: {
            type: DataTypes.STRING(225),
        },
        licence_number: {
            type: DataTypes.STRING(225),
        },
        expiry_date: {
            type: DataTypes.STRING(225),
        },
        tax_number: {
            type: DataTypes.STRING(225),
        },
        website_link: {
            type: DataTypes.STRING(225),
        },
        facebook_page: {
            type: DataTypes.STRING(225),
        },
        instagram_page: {
            type: DataTypes.STRING(225),
        },
        number_of_locations: {
            type: DataTypes.INTEGER,
        },
        nature_of_business: {
            type: DataTypes.STRING(225),
        },
        url_owner_photo_with_id: {
            type: DataTypes.STRING(225),
        },
        url_service_provider_id: {
            type: DataTypes.STRING(225),
        },
        url_trade_license: {
            type: DataTypes.STRING(225),
        },
        url_signed_company_form: {
            type: DataTypes.STRING(225),
        },
        nature_of_business: {
            type: DataTypes.STRING(225),
        },
    }, {
        tableName: 'companies'
    });
};
