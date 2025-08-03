const express = require('express');
const router = express.Router();
const shopController = require('../Controller/shop');

// RESTful routes
router.get('/list_shop', shopController.getAllShops);

router.get('/today_sales', shopController.getTodaySalesTotal);


router.get('/list_shop/:id', shopController.getById);

router.post('/create_shop', shopController.createShop);
router.delete('/delete_shop/:id', shopController.deleteShop);

module.exports = router;