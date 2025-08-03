const express = require('express');
const router = express.Router();
const name = require('../Controller/name');

router.get('/list_name', name.list);
router.post('/create_name', name.create);
router.get('/listById_name/:id', name.listById);
router.put('/update_name/:id', name.update);
router.delete('/delete_name/:id', name.deletes);

module.exports = router;