const express = require('express');
const router = express.Router();
const typeProductsController = require('../Controller/type_products');

router.get('/list_type_products', typeProductsController.getAllTypeProducts);
router.get('/list_type_products/:id', typeProductsController.getTypeProductById);
router.post('/create_type_products', typeProductsController.createTypeProduct);
router.put('/update_type_products/:id', typeProductsController.updateTypeProduct);
router.delete('/delete_type_products/:id', typeProductsController.deleteTypeProduct);

module.exports = router;
