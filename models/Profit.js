/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Profit', {
    profit_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    kitchen_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'Profit'
  });
};
