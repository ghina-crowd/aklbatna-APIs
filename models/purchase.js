/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('purchases', {
    purchase_id: {
      type: DataTypes.STRING(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    deal_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    qrcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(1),
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    sub_deal_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  }, {
    tableName: 'purchases'
  });
};
