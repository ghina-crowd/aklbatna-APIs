/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('requests', {
    request_id: {
      type: DataTypes.STRING(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    request_from: {
      type: DataTypes.STRING(45),
    },
    request_to: {
      type: DataTypes.STRING(45),
    },
    first_name: {
      type: DataTypes.STRING(1),
    },
    last_name: {
      type: DataTypes.STRING(100),
    },
    phone: {
      type: DataTypes.STRING(100),
    },
    type: {
      type: DataTypes.STRING(100),
    },
    status: {
      type: DataTypes.STRING(100),
    },
    created_date: {
      type: DataTypes.STRING(100),
    }

  }, {
    tableName: 'requests'
  });
};
