
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('incentives', {
        company_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        reach: {
            type: DataTypes.INTEGER,
        },
        rate_count: {
            type: DataTypes.INTEGER,
        },
        complains: {
            type: DataTypes.INTEGER,
        },
        claim: {
            type: DataTypes.INTEGER,
        },
        fake_deals: {
            type: DataTypes.INTEGER,
        },
        unjustified: {
            type: DataTypes.INTEGER,
        },

    }, {
        tableName: 'incentives'
    });
};
