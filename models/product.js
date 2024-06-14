"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: "categoryId" });
      Product.hasOne(models.CartItem, { foreignKey: "productId" });
      Product.hasOne(models.OrderItem, { foreignKey: "productId" });
    }
  }
  Product.init(
    {
      categoryId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      discription: DataTypes.STRING,
      price: DataTypes.BIGINT,
      stock: DataTypes.BIGINT,
      imageUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
