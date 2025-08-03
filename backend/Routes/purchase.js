const express = require('express');
const router = express.Router();
const purchase = require('../Controller/purchase');

router.get('/list_purchase', purchase.list);
router.get('/listById_purchase/:id', purchase.listById);
router.post('/create_purchase', purchase.create);
router.put('/update_purchase/:id', purchase.update);
router.delete('/delete_purchase/:id', purchase.deletes);

router.get('/list_purchase_z', purchase.list_z);


module.exports = router