/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('about_coboney', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    arabic: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    english: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'about_coboney'
  });
};
