// controller/profileController.js
const { where } = require("sequelize");
const db = require("../models");
const cart = require("../models/cart");
const cartitem = require("../models/cartitem");
const User = db.User;
const Product = db.Product;
const Cart = db.Cart;
const CartItem = db.CartItem;
const Category = db.Category;
const Order = db.Order;
const OrderItem = db.OrderItem;
const Sequelize = db.Sequelize;
const getUser = async (req, res) => {
  try {
    const { data } = req.authData;
    var { IdOfUser } = data;
    const { firstName, lastName, email, phoneNumber } = data;
    res.status(200).json({
      message: "Profile accessed",
      data: { firstName, lastName, email, phoneNumber },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user profile",
      error: error.message,
    });
  }
};

var getProducts = async (req, res) => {
  try {
    var data = await Product.findAll();
    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving products",
      error: error.message,
    });
  }
};

var addProducts = async (req, res) => {
  try {
    var { name, description, price, stock, imageUrl } = req.body;
    var CtgryCreate = await Category.create({
      name: "Clothes",
      description: "All types of clothes are in this",
      parentId: 1,
    });

    var data = await Product.create({
      categoryId: CtgryCreate.id,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      imageUrl: req.body.imageUrl,
    });

    res.status(201).json({
      message: "Product created",
      data: {
        id: data.id,
        categoryId: 1,
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

var getOneProduct = async (req, res) => {
  try {
    var data = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving product",
      error: error.message,
    });
  }
};

var editProduct = async (req, res) => {
  try {
    var { name, description, price, stock, imageUrl } = req.body;

    var data = await Product.update(
      {
        categoryId: 1,
        name: name,
        description: description,
        price: price,
        stock: stock,
        imageUrl: imageUrl,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (data[0] === 0) {
      return res.status(404).json({
        message: "Product not found or no changes made",
      });
    }

    res.status(200).json({
      message: "Product edited successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error editing product",
      error: error.message,
    });
  }
};

var deleteProduct = async (req, res) => {
  try {
    var data = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (data === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.json({
      message: "Product deleted",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

var getCartItems = async (req, res) => {
  try {
    const { data } = req.authData;
    const userId = data.id;

    let cart = await Cart.findOne({ where: { userId: userId } });
    if (!cart) {
      cart = await Cart.create({ userId: userId });
    }

    var Content = await CartItem.findAll({
      where: {
        cartId: cart.id,
      },
      include: [Product],
    });
    res.json({
      message: "Cart details:",
      data: Content,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving cart items",
      error: error.message,
    });
  }
};

var addProductInCart = async (req, res) => {
  try {
    const { data } = req.authData;
    const userId = data.id;

    let cart = await Cart.findOne({ where: { userId: userId } });
    if (!cart) {
      cart = await Cart.create({ userId: userId });
    }
    const productId = req.params.productId;
    const quantity = req.body.quantity || 1;

    const product = await Product.findOne({
      where: {
        id: productId,
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      });
    }

    res.status(200).json({
      message: "Product added to cart",
      data: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding product to cart",
      error: error.message,
    });
  }
};

var removeProductInCart = async (req, res) => {
  try {
    const { data } = req.authData;
    const userId = data.id;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ where: { userId: userId } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const rowsDeleted = await CartItem.destroy({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    res.json({
      message: "Product removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error removing product from cart",
      error: error.message,
    });
  }
};

var cartCheckout = async (req, res) => {
  try {
    const { data } = req.authData;
    const userId = data.id;

    const cart = await Cart.findOne({ where: { userId: userId } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{ model: Product }],
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: "No items in the cart" });
    }

    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.quantity * item.Product.price;
    });

    const order = await Order.create({
      userId: userId,
      orderDate: Sequelize.literal("CURRENT_TIMESTAMP"),
      status: "pending",
      totalAmount: totalPrice,
    });

    // Create order items for each cart item
    const orderItems = [];
    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];
      const orderItem = await OrderItem.create({
        orderId: order.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: cartItem.Product.price,
        createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
      orderItems.push(orderItem);
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.status(200).json({
      message: "Proceeded to checkout",
      order: order,
      orderItems: orderItems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during checkout",
      error: error.message,
    });
  }
};

module.exports = {
  getUser,
  getProducts,
  addProducts,
  getOneProduct,
  editProduct,
  deleteProduct,
  getCartItems,
  addProductInCart,
  removeProductInCart,
  cartCheckout,
};
