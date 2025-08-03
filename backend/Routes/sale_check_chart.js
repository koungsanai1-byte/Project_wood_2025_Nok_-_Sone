const express = require('express');
const router = express.Router();
const sale_check_chart = require('../Controller/sale_check_chart');

router.get('/total-sales', sale_check_chart.getTotalSales);
router.get('/monthly-sales', sale_check_chart.getMTS);
router.get('/latest-sales', sale_check_chart.getLatestTotalSales);
router.get('/chart-data-s', sale_check_chart.getChartData);


module.exports = router;
