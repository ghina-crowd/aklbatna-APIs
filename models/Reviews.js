/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Reviews', {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    kitchen_id: {
      type: DataTypes.INTEGER,
    },
    meal_id: {
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    order_pakaging_rate: {
      type: DataTypes.INTEGER,
    },
    value_rate: {
      type: DataTypes.INTEGER,
    },
    delivery_rate: {
      type: DataTypes.INTEGER,
    },
    final_rate: {
      type: DataTypes.INTEGER,
    },
    quality_rate: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'Reviews'
  });
};
