/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('notifications', {
    notification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    read: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'notifications'
  });
};
