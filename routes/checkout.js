const express = require('express');

const router = express.Router();

const { index } = require('../controllers/checkout');
router.get('/', index);

module.exports = router;