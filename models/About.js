/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('about', {
    about_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    title_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'about'
  });
};
