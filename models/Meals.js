/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Meals', {
    meal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    menu_id: {
      type: DataTypes.INTEGER,
    },
    name_ar: {
      type: DataTypes.STRING,
    },
    name_en: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
    },
    price_monthly: {
      type: DataTypes.INTEGER,
    },
    active: {
      type: DataTypes.INTEGER,
    },
    price_weekly: {
      type: DataTypes.INTEGER
    },
    description_ar: {
      type: DataTypes.INTEGER,
    },
    description_en: {
      type: DataTypes.INTEGER
    },
    total_served: {
      type: DataTypes.INTEGER,
    },
    category_id: {
      type: DataTypes.INTEGER
    },
    featured: {
      type: DataTypes.INTEGER
    },
    kitchen_id: {
      type: DataTypes.INTEGER,
    },
    final_rate: {
      type: DataTypes.INTEGER,
    }
  }, {
    tableName: 'Meals'
  });
};
