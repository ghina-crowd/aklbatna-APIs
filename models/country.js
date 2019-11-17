/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_admin', {
    email: {
      type: DataTypes.STRING(45),
    },
    password: {
      type: DataTypes.STRING(45),
    },
    session_id: {
      type: DataTypes.STRING(500),
    },
    first_name: {
      type: DataTypes.STRING(45),
    },
    phone: {
      type: DataTypes.STRING(45),
    },
    last_name: {
      type: DataTypes.STRING(45),
    },
    user_admin_id: {
      type: DataTypes.STRING(45),
    },
    otp: {
      type: DataTypes.STRING(45),
    },
    user_id: {
      type: DataTypes.STRING(45),
    },
    active: {
      type: DataTypes.STRING(45),
    }
  }, {
    tableName: 'user_admin'
  });
};
