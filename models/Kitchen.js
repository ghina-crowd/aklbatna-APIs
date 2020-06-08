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
    lat: {
      type: DataTypes.INTEGER
    },
    lng: {
      type: DataTypes.INTEGER
    },
    active: {
      type: DataTypes.INTEGER
    },
    location: {
      type: DataTypes.STRING
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
    },
    busy: {
      type: DataTypes.INTEGER,
    },
    is_delivery: {
      type: DataTypes.BOOLEAN,
    }
  }, {
    tableName: 'Kitchen'
  });
};
