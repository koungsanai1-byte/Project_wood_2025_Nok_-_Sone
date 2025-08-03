const express = require('express');
const router = express.Router();
const inspectionController = require('../Controller/inspection');

// 📥 สร้างข้อมูล inspection
router.post('/create_inspection', inspectionController.createInspection);

// 📄 ดึงข้อมูล inspection ทั้งหมด
router.get('/list_inspection', inspectionController.getAllInspections);

// 🔍 ดึงข้อมูล inspection รายตัว
router.get('/listById_inspection/:id', inspectionController.getInspectionById);

// ❌ ลบ inspection
router.delete('/delete_inspection/:id', inspectionController.deleteInspection);

// 📋 ดึง drying ที่พร้อมตรวจสอบ
router.get('/drying_ready_for_inspection', inspectionController.getDryingReadyForInspection);

// 📋 ดึงข้อมูล inspection ที่ปรับปรุงแล้ว
router.get('/improved_inspections', inspectionController.getImprovedInspections);


module.exports = router;
