/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('offers', {
    offer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    title_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meal_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    kitchen_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_served: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'offers'
  });
};
