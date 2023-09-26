const express = require('express');

const router = express.Router();

const { index } = require('../controllers/cocktails');
router.get('/', index);

module.exports = router;