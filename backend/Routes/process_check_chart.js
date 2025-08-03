const express = require('express');
const router = express.Router();
const controller = require('../Controller/process_check_chart');

router.get('/total-amount', controller.getTotalAmount);
router.get('/monthly-amount', controller.getMonthlyAmount);
router.get('/latest-amount', controller.getLatestAmount);
router.get('/get_chart', controller.getChartData);

module.exports = router;
