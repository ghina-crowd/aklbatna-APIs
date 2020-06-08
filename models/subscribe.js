/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('subscribe', {
    subscribe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscribe: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'subscribe'
  });
};
