/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Kitchen', {
    kitchen_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    image: {
      type: DataTypes.STRING,
    },
    name_ar: {
      type: DataTypes.STRING,
    },
    name_en: {
      type: DataTypes.STRING,
    },
    description_ar: {
      type: DataTypes.STRING,
    },
    description_en: {
      type: DataTypes.STRING,
    },
    final_rate: {
      type: DataTypes.INTEGER,
    },
    featured: {
      type: DataTypes.INTEGER
    },
    start_time: {
      type: DataTypes.TIME
    },
    end_time: {
      type: DataTypes.TIME
    },
    served_count: {
      type: DataTypes.INTEGER,
    },
    final_order_pakaging_rate: {
      type: DataTypes.INTEGER,
    },
    final_quality_rate: {
      type: DataTypes.INTEGER,
    },
    final_delivery_rate: {
      type: DataTypes.INTEGER,
    },
    final_value_rate: {
      type: DataTypes.INTEGER,
    }
  }, {
    tableName: 'Kitchen'
  });
};
