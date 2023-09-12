const express = require('express');

const router = express.Router();

const { isAuthenticated, profile: profile } = require('../controllers/usercontroller');
router.get('/', isAuthenticated, profile);

module.exports = router;