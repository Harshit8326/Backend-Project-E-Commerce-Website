const express = require("express");
const router = express.Router();
const orderCtrl = require("../controller/orderController");

router.get("/", orderCtrl.getOrders);

router.get("/:id", orderCtrl.getOrderDetails);


router.put("/cancel/:id", orderCtrl.cancelOrder);

router.put("/confirm/:id", orderCtrl.confirmOrder);

router.put("/ship/:id", orderCtrl.shipOrder);

router.put("/deliver/:id", orderCtrl.cmpltedOrder);

module.exports = router;
