const express = require("express");
const path = require("path");
const sequelize = require('./models');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const profileRoutes=require('./routes/profileRoutes');
const orderRoutes=require('./routes/orderRoutes');
const paymentRoutes=require('./routes/paymentRoutes');
const adminRoutes=require('./routes/adminRoutes');
const emailRoutes=require('./routes/emailRoutes');

const { profile } = require("console");

// const userCtrl = require('./controller/userController');
// const bcrypt = require('bcryptjs');

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("Hello");
});

app.use('/auth', authRoutes);

app.use('/profile',profileRoutes)


app.use('/orders',orderRoutes)

app.use('/payment',paymentRoutes)

app.use('/admin',adminRoutes)

app.use('/email',emailRoutes)

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
