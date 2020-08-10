/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('alkebetna_order', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kitchen_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order_timing: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    delivery_charges: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    payment_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tax: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    os: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'alkebetna_order'
  });
};
