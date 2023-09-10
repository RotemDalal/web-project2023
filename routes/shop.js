const express = require('express');

const router = express.Router();

const { index } = require('../controllers/shop');

router.get('/', index);

module.exports = router;