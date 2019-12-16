/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user_admin', {
    user_admin_id: {
      type: DataTypes.STRING(45),
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(45),
    },
    password: {
      type: DataTypes.STRING(45),
    },

    first_name: {
      type: DataTypes.STRING(45),
    },
    username: {
      type: DataTypes.STRING(45),
    },
    full_name: {
      type: DataTypes.STRING(45),
    },
    joining_date: {
      type: DataTypes.STRING(45),
    },
    account_status: {
      type: DataTypes.STRING(45),
    },
    phone: {
      type: DataTypes.STRING(45),
    },
    last_name: {
      type: DataTypes.STRING(45),
    },
    otp: {
      type: DataTypes.STRING(45),
    },
    active: {
      type: DataTypes.STRING(45),
    },
    latitude: {
      type: DataTypes.STRING(45),
    },
    longitude: {
      type: DataTypes.STRING(45),
    },

    picture: {
      type: DataTypes.STRING(200),
    },
    address: {
      type: DataTypes.STRING(200),
    },
    user_type: {
      type: DataTypes.STRING(45),
    },

    photo: {
      type: DataTypes.STRING(45),
    },
  }, {
    tableName: 'user_admin'
  });
};
