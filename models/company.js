
module.exports = function(sequelize, DataTypes) {
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
        website_link: {
            type: DataTypes.STRING(225),
        },
    }, {
        tableName: 'companies'
    });
};
