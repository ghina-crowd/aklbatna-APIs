/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Favourite', {
    favourite_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    meal_id: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'Favourite'
  });
};
