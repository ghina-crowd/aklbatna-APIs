/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Menu', {
    menu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    kitchen_id: {
      type: DataTypes.INTEGER,
    },
    name_ar: {
      type: DataTypes.STRING,
    },
    name_en: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'Menu'
  });
};
