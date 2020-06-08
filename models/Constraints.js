/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('constraints', {
    max_percentage: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    }
  }, {
    tableName: 'constraints'
  });
};
