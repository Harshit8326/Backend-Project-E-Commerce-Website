const { where } = require("sequelize");
var db = require("../models");
const order = require("../models/order");
const Order = db.Order;
const OrderItem = db.OrderItem;

var getOrders = async (req, res) => {
    try {
        var data = await Order.findAll();
        res.json({
            message: "Orders:",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching orders",
            error: error.message,
        });
    }
};

var getOrderDetails = async (req, res) => {
    try {
        var data = await OrderItem.findAll({
            where: {
                orderId: req.params.id,
            },
        });
        res.json({
            message: `Order:${req.params.id} details:`,
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: `Error fetching details for order ${req.params.id}`,
            error: error.message,
        });
    }
};

var confirmOrder = async (req, res) => {
    try {
        var data = await Order.update(
            { status: "Confirmed" },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json({
            message: "Order status updated to Confirmed",
            orderId: req.params.id,
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: `Error confirming order ${req.params.id}`,
            error: error.message,
        });
    }
};

var shipOrder = async (req, res) => {
    try {
        var data = await Order.update(
            { status: "Shipped" },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json({
            message: "Order status updated to Shipped",
            orderId: req.params.id,
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: `Error shipping order ${req.params.id}`,
            error: error.message,
        });
    }
};

var cmpltedOrder = async (req, res) => {
    try {
        var data = await Order.update(
            { status: "Delivered" },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json({
            message: "Order status updated to Delivered",
            orderId: req.params.id,
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: `Error marking order ${req.params.id} as delivered`,
            error: error.message,
        });
    }
};

var cancelOrder = async (req, res) => {
    try {
        var data = await Order.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({
            message: "Order Deleted",
        });
    } catch (error) {
        res.status(500).json({
            message: `Error deleting order ${req.params.id}`,
            error: error.message,
        });
    }
};

module.exports = {
    getOrders,
    getOrderDetails,
    confirmOrder,
    shipOrder,
    cmpltedOrder,
    cancelOrder,
};
