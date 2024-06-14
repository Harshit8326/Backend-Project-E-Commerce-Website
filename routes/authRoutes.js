const express = require('express');
const router = express.Router();
const authCtrl=require('../controller/authController')

router.post('/register', authCtrl.registerUser);

router.post('/login', authCtrl.loginUser);

module.exports = router;