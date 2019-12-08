
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('images', {
        img_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        deal_id: {
            type: DataTypes.INTEGER,
            foreignKey: true
        },
        source: {
            type: DataTypes.STRING(225),
        },


    }, {
        tableName: 'deal_images'
    });
};
