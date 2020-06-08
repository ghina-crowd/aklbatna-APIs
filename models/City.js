/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('City', {
    city_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'City'
  });
};
