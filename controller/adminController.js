const db = require("../models");

var dashboard = async (req, res) => {
    try {
        const orders = await db.Order.findAll();
        const products = await db.Product.findAll();
        const users = await db.User.findAll();

        res.render("admin/dashboard", {
            orders: orders,
            products: products,
            users: users,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error loading dashboard data",
            error: error.message,
        });
    }
};

module.exports = {
    dashboard,
};
