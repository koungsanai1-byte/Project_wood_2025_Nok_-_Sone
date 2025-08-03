const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');

router.post('/login', authController.login);
router.post('/verify-token', authController.verifyToken);

module.exports = router;
