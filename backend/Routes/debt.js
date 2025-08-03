const express = require('express');
const router = express.Router();
const debt = require('../Controller/debt');

router.get('/list_debt', debt.getAllShops);
router.get('/list_debt_invoices', debt.get_debt);
router.post('/create_debt', debt.create_debt);



module.exports = router;