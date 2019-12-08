/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('purchase', {
    pk_account_id: {
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
    }
  }, {
    tableName: 'purchase'
  });
};
