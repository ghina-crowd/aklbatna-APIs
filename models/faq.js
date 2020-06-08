/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('faq', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    Question: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Question_ar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Answer_ar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: 'faq'
  });
};
