const express = require('express');
const router = express.Router();
const controller = require('../Controller/purchase_check');

// total
router.get('/total', controller.getTotalCost);
router.get('/monthly', controller.getMonthlyCost);
router.get('/latest', controller.getLatestPurchaseCost);

// amount
router.get('/amount_y', controller.amount_y);
router.get('/amount_m', controller.amount_m);
router.get('/amount_l', controller.amount_l);


module.exports = router;
