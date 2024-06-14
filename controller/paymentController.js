const { NOW, where } = require("sequelize");
var db = require("../models");
const order = require("../models/order");
const Order = db.Order;
const OrderItem = db.OrderItem;
const Payment = db.Payment;
var Sequelize = db.Sequelize;
const ExcelJS = require("exceljs");
const path = require("path");

var createPayment = async (req, res) => {
  try {
    var reqData = req.body;
    var orderDetail = await Order.findOne({
      where: {
        id: reqData.orderId,
      },
    });

    if (!orderDetail) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    var data = await Payment.create({
      orderId: reqData.orderId,
      paymentMethod: reqData.paymentMethod,
      paymentStatus: "pending",
      paymentDate: Sequelize.literal("CURRENT_TIMESTAMP"),
      amount: orderDetail.totalAmount,
    });

    res.json({
      message: "Payment created, move to Payment rollback",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating payment",
      error: error.message,
    });
  }
};

var paymentRollback = async (req, res) => {
  try {
    var reqData = req.body;
    // Example request body:
    // {
    //     "transactionId": "txn_1234567890",
    //     "paymentStatus": "paid",
    //     "amount": 100.00,
    //     "customerEmail": "customer@example.com"
    // }

    var orderId = req.params.id;
    var orderDetail = await Order.findOne({
      where: {
        id: orderId,
      },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          attributes: [
            "id",
            "orderId",
            "productId",
            "quantity",
            "price",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
    });

    if (!orderDetail) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      reqData.paymentStatus === "paid" &&
      reqData.amount === orderDetail.totalAmount
    ) {
      var statusUpdate = await Payment.update(
        { paymentStatus: "successful" },
        {
          where: {
            orderId: orderId,
          },
        }
      );
      var statusUpdate2 = await Order.update(
        { status: "successful" },
        {
          where: {
            id: orderId,
          },
        }
      );
      // Create Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Order Details");
      // Define columns for Order and OrderItem details
      worksheet.columns = [
        { header: "Order ID", key: "orderId", width: 15 },
        { header: "User ID", key: "userId", width: 15 },
        { header: "Order Date", key: "orderDate", width: 20 },
        { header: "Status", key: "status", width: 15 },
        { header: "Total Amount", key: "totalAmount", width: 15 },
        { header: "Created At", key: "createdAt", width: 20 },
        { header: "Updated At", key: "updatedAt", width: 20 },
        { header: "Order Item ID", key: "orderItemId", width: 15 },
        { header: "Product ID", key: "productId", width: 15 },
        { header: "Quantity", key: "quantity", width: 15 },
        { header: "Price", key: "price", width: 15 },
        { header: "Item Created At", key: "itemCreatedAt", width: 20 },
        { header: "Item Updated At", key: "itemUpdatedAt", width: 20 },
      ];

      // Add rows for Order and associated OrderItems
      orderDetail.orderItems.forEach((item) => {
        worksheet.addRow({
          orderId: orderDetail.id,
          userId: orderDetail.userId,
          orderDate: orderDetail.orderDate,
          status: orderDetail.status,
          totalAmount: orderDetail.totalAmount,
          createdAt: orderDetail.createdAt.toISOString(),
          updatedAt: orderDetail.updatedAt.toISOString(),
          orderItemId: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          itemCreatedAt: item.createdAt.toISOString(),
          itemUpdatedAt: item.updatedAt.toISOString(),
        });
      });

      // Generate a unique filename for the Excel file
      const excelFileName = `${orderDetail.id}_order_details.xlsx`;
      const excelFilePath = path.join(__dirname, `../exports/${excelFileName}`);

      // Save the Excel file
      await workbook.xlsx.writeFile(excelFilePath);

      res.status(200).json({
        message: "Payment successful",
        order: orderDetail,
      });
    } else {
      res.status(400).json({
        message: "Payment failed or amount mismatch",
        order: orderDetail,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error processing payment rollback",
      error: error.message,
    });
  }
};

module.exports = {
  createPayment,
  paymentRollback,
};
