const express = require('express');
const router = express.Router();
const size = require('../Controller/size');

router.get('/list_size', size.list);
router.get('/listById_size/:id', size.listById);
router.post('/create_size', size.create);
router.put('/update_size/:id', size.update);
router.delete('/deletes_size/:id', size.deletes);


module.exports = router