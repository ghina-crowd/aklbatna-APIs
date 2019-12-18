
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('company_branches', {
        branch_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        company_id: {
            type: DataTypes.INTEGER,
            foreignKey: true
        },
        status: {
            type: DataTypes.INTEGER,
        },
        name_ar: {
            type: DataTypes.STRING(225),
        },
        name_en: {
            type: DataTypes.STRING(225),
        },
        address: {
            type: DataTypes.STRING(1000),
        },
        latitude: {
            type: DataTypes.STRING(225),
        },
        longitude: {
            type: DataTypes.STRING(225),
        }
    }, {
        tableName: 'company_branches'
    });
};
