/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('general_terms', {
    terms_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    text_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    text_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type:
    {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'general_terms'
  });
};
