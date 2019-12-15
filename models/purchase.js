/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('purchases', {
    purchase_id: {
      type: DataTypes.STRING(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    deal_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(1),
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  }, {
    tableName: 'purchases'
  });
};
