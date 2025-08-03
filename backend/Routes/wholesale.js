const express = require('express');
const router = express.Router();
const wholesaleController = require('../Controller/wholesale');

router.post('/create_wholesale', wholesaleController.createWholesale);
router.get('/list_wholesale', wholesaleController.getAllWholesales);
router.get('/list_wholesale/:id', wholesaleController.getWholesaleById);
router.delete('/delete_wholesale/:id', wholesaleController.deleteWholesale);

module.exports = router;
