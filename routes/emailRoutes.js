const express = require('express');
const router = express.Router();
const emailCtlr = require('../controller/emailController');

router.get('/', emailCtlr.sendEmail);

module.exports = router;
