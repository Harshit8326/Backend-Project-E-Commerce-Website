'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' });
      Order.hasMany(models.OrderItem, { foreignKey: "orderId" });
      Order.hasOne(models.Payment,{ foreignKey: "orderId" });
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    orderDate: DataTypes.DATE,
    status: DataTypes.STRING,
    totalAmount: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};