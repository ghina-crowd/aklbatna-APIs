
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('rating', {
        rating_id: {
            type: DataTypes.STRING(225),
            primaryKey: true,
            autoIncrement: true
        },
        deal_id: {
            type: DataTypes.STRING(225),
            foreignKey: true
        },
        user_id: {
            type: DataTypes.STRING(225),
            foreignKey: true
        },
        rate: {
            type: DataTypes.INTEGER,
        },
        date: {
            type: DataTypes.DATE,
        },
        comment: {
            type: DataTypes.STRING(225),
        },

    }, {
        tableName: 'deal_ratings'
    });
};
