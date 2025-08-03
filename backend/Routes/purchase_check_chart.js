const express = require('express');
const router = express.Router();
const controller = require('../Controller/purchase_check_chart');

router.get('/total-s', controller.getTotalPurchase);
router.get('/monthly-s', controller.getMonthlyPurchase);
router.get('/latest', controller.getLatestPurchase);
router.get('/chart-data', controller.getChartData);

module.exports = router;