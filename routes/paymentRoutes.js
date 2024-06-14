const express = require("express");
const router = express.Router();
const payCtrl=require('../controller/paymentController')

router.post("/", payCtrl.createPayment);

router.post('/status/:id',payCtrl.paymentRollback);

module.exports = router;