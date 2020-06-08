/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Account', {
    account_id: {
      type: DataTypes.STRING(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    owner_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    cvc: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    card_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: false,
    }
  }, {
    tableName: 'Account'
  });
};
