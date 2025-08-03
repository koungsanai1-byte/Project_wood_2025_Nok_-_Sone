const express = require('express');
const router = express.Router();
const costController = require('../Controller/sale_check');

router.get('/total-cost', costController.getTotalCost);
router.get('/total-profit', costController.getTotalProfit);

module.exports = router;
