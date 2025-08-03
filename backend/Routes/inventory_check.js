const express = require('express');
const router = express.Router();
const inventory_check = require('../Controller/inventory_check');

router.get('/amount_all_total', inventory_check.getTotalAmount);
router.get('/amount_all_volume', inventory_check.getAllVolumes);


module.exports = router;