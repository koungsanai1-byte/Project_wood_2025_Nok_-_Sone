const express = require('express');
const router = express.Router();
const sizeController = require('../Controller/size_products');

router.get('/list_size_products', sizeController.getAllSizeProducts);
router.get('/list_size_products/:id', sizeController.getSizeProductById);
router.post('/create_size_products', sizeController.createSizeProduct);
router.put('/update_size_products/:id', sizeController.updateSizeProduct);
router.delete('/delete_size_products/:id', sizeController.deleteSizeProduct);

module.exports = router;
