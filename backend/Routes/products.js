const express = require('express');
const router = express.Router();
const productsController = require('../Controller/products');


router.get('/list_products', productsController.getAllProducts);
router.get('/list_products/:id', productsController.getProductById);
router.post('/create_products', productsController.createProduct);
router.put('/update_products/:id', productsController.updateProduct);
router.delete('/delete_products/:id', productsController.deleteProduct);

module.exports = router;
