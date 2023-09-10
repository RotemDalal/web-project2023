const express = require('express');

const router = express.Router();

const { index } = require('../controllers/shop');
const { isAuthenticated } = require('../controllers/usercontroller');
router.get('/', index);

module.exports = router;