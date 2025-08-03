const express = require('express');
const router = express.Router();
const improvementController = require('../Controller/improvenment');

// สร้าง
router.post('/create_improvenment', improvementController.createImprovement);

// ทั้งหมด
router.get('/list_improvenment', improvementController.getAllImprovements);

// รายการเดียว
router.get('/listById_improvenment/:id', improvementController.getImprovementById);

// อัปเดต
router.put('/update_improvenment/:id', improvementController.updateImprovement);

// ลบ
router.delete('/delete_improvenment/:id', improvementController.deleteImprovement);

router.get('list_improvement_checked',improvementController.list_checked);


module.exports = router;
