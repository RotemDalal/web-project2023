const express = require('express');

const router = express.Router();

const { isAdmin, admin } = require('../controllers/usercontroller');
router.get('/', isAdmin, admin);

module.exports = router;