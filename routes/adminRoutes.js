const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController.js');

router.get('/dashboard', adminController.dashboard);

module.exports = router;
