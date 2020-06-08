/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('alkebetna_sub_order', {
    sub_order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    offer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    meal_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'alkebetna_sub_order'
  });
};
