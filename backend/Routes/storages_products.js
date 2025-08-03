const express = require('express');
const router = express.Router();
const storagesController = require('../Controller/storages_products');

router.get('/list_storages_products', storagesController.getAllStoragesProducts);
router.get('/list_storages_products/:id', storagesController.getStoragesProductById);
router.post('/create_storages_products', storagesController.createStoragesProduct);
router.put('/update_storages_products/:id', storagesController.updateStoragesProduct);
router.delete('/delete_storages_products/:id', storagesController.deleteStoragesProduct);

module.exports = router;
