/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Banner', {
    banner_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING,
    },
    button: {
      type: DataTypes.STRING,
    },
    description_en: {
      type: DataTypes.STRING,
    },
    description_ar: {
      type: DataTypes.STRING,
    },
    redirect: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'Banner'
  });
};
