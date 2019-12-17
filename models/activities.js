
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('activities', {
        activity_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        admin_user_id: {
            type: DataTypes.INTEGER,
            foreignKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            foreignKey: true
        },
        deal_id: {
            type: DataTypes.INTEGER,
            foreignKey: true
        },
        type: {
            type: DataTypes.STRING(225),
        },
        status: {
            type: DataTypes.STRING(225),
        }
    }, {
        tableName: 'activities'
    });
};
