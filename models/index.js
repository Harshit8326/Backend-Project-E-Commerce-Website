"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User.hasMany(db.Order, { foreignKey: "userId" });
db.Order.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Address, { foreignKey: "userId" });
db.Address.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasOne(db.Cart, { foreignKey: "userId" });
db.Cart.belongsTo(db.User, { foreignKey: "userId" });

db.Category.hasMany(db.Product, { foreignKey: "categoryId" });
db.Product.belongsTo(db.Category, { foreignKey: "categoryId" });

db.Product.hasOne(db.CartItem, { foreignKey: "productId" });
db.CartItem.belongsTo(db.Product, { foreignKey: "productId" });

db.Product.hasOne(db.OrderItem, { foreignKey: "productId" });
db.OrderItem.belongsTo(db.Product, { foreignKey: "productId" });

db.Order.hasMany(db.OrderItem, { foreignKey: "orderId", as: 'orderItems' });
db.OrderItem.belongsTo(db.Order, { foreignKey: "orderId" });

db.Cart.hasMany(db.CartItem, { foreignKey: "cartId" });
db.CartItem.belongsTo(db.Cart, { foreignKey: "cartId" });

db.Order.hasOne(db.Payment, { foreignKey: "orderId" });
db.Payment.belongsTo(db.Order, { foreignKey: "orderId" });

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

module.exports = db;
