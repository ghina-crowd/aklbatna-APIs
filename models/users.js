/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_admin', {
    user_admin_id: {
      type: DataTypes.STRING(45),
    },
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
    otp: {
      type: DataTypes.STRING(45),
    },
    otp_val: {
      type: DataTypes.STRING(45),
    },
    user_id: {
      type: DataTypes.STRING(45),
    },
    active: {
      type: DataTypes.STRING(45),
    },
    token: {
      type: DataTypes.STRING(500),
    },
    lattitude: {
      type: DataTypes.STRING(45),
    },
    longitude: {
      type: DataTypes.STRING(45),
    },
    company_name: {
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
    name: {
      type: DataTypes.STRING(45),
     },
    locale: {
      type: DataTypes.STRING(45),
    },
    company_name_arabic: {
      type: DataTypes.STRING(45),
    },
    photo: {
      type: DataTypes.STRING(45),
    },
  }, {
    tableName: 'user_admin'
  });
};
