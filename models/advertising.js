/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('advertising', {
    add_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    deal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'advertising'
  });
};
