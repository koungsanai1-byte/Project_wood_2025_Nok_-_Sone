const express = require('express');
const router = express.Router();
const productsController = require('../Controller/products_check');

// ຈຳນວນໃນສະຕ໋ອກທອງໝົດ
router.get('/count/all', productsController.countAllProducts);

// ຈຳນວນສຶນຄ້າຍັງນ້ອຍ
router.get('/count/low-stock', productsController.countLowStockProducts);

module.exports = router;
