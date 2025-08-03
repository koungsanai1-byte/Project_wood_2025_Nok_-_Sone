const express = require('express');
const router = express.Router();
const type = require('../Controller/type');

router.get('/list_type', type.list);
router.post('/create_type', type.create);
router.get('/listById_type/:id', type.listById);
router.put('/update_type/:id', type.update);
router.delete('/delete_type/:id', type.deletes); // ✅ 

module.exports = router;
