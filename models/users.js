/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    joining_date: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.INTEGER
    },
    active: {
      type: DataTypes.INTEGER
    },
    user_type: {
      type: DataTypes.STRING,
    },
    profile: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'users'
  });
};
