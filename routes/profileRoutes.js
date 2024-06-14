const express = require('express');
const router = express.Router();
const profileCtrl=require('../controller/profileContoller');

var jwt = require("jsonwebtoken");


// router.post('/login', profilectrl.loginUser);


const secretKey = "YoYo";

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    jwt.verify(token, secretKey, (err, authData) => {
      if (err) {
        res.sendStatus(403); 
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
}


router.post('/',verifyToken,profileCtrl.getUser);

router.get('/products',profileCtrl.getProducts);

router.post('/products/add',profileCtrl.addProducts);

router.get('/products/:id',profileCtrl.getOneProduct);

router.post('/products/edit/:id',profileCtrl.editProduct);

router.delete('/products/delete/:id',profileCtrl.deleteProduct);


router.get('/cart',verifyToken,profileCtrl.getCartItems);

router.post('/cart/add/:productId',verifyToken,profileCtrl.addProductInCart)


router.delete('/cart/remove/:productId',verifyToken,profileCtrl.removeProductInCart)

router.post('/cart/checkout', verifyToken,profileCtrl.cartCheckout)


// /admin/dashboard:
module.exports = router;