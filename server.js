const express = require('express');
const mongoose = require('mongoose');
//... other imports

const userController = require('./controllers/usercontroller');
const productController = require('./controllers/productcontroller');

//... your app setup

// Routes
//app.get('/', (req, res) => { ... });

app.post('/register', userController.register);
app.post('/login', userController.login);
app.get('/profile', userController.profile);

app.get('/products', productController.getProducts);

//... listen to your server
