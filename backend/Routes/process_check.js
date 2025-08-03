const express = require('express');
const router = express.Router();
const process_check = require('../Controller/process_check');

router.get('/amount_requsition_all', process_check.getrequsitionAll);
router.get('/amount_requsition_today',process_check.getrequsitionToday );
router.get('/amount_process_all', process_check.getProcessAll);
router.get('/amount_process_today',process_check.getProcessToday );

module.exports = router;