/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Category', {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
  }, {
    tableName: 'Category'
  });
};
