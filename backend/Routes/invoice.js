const express = require('express');
const router = express.Router();
const shopController = require('../Controller/invoice');

// RESTful routes
router.get('/list_shop_invoices', shopController.getAllShops);

router.get('/today_sales_invoices', shopController.getTodaySalesTotal);


router.get('/list_shop_invoices/:id', shopController.getById);

router.post('/create_shop_invoices', shopController.createShop);
router.delete('/delete_shop_invoices/:id', shopController.deleteShop);

router.patch('/confirm_sale/:id', shopController.confirmSaleStatus);




module.exports = router;