/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Contact', {
    contact_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'Contact'
  });
};
