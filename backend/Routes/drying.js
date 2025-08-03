const express = require("express");
const router = express.Router();
const dryingController = require("../Controller/drying");

// ⚠️ สำคัญ: Routes ที่เฉพาะเจาะจงต้องมาก่อน routes ที่ใช้ parameter

// Routes สำหรับ process (เฉพาะเจาะจง)
router.get("/list_process", dryingController.getProcessListReady);
router.get("/drying/process/:id_process", dryingController.getProcessByIdForDrying);

// Routes สำหรับการจัดการสถานะ (เฉพาะเจาะจง)
router.put('/drying/status-ready/:id', dryingController.updateDryingStatusReady);
router.put('/drying/confirm-done/:id', dryingController.confirmDryingDone);

// Routes พื้นฐาน CRUD
router.post("/drying", dryingController.createDrying);
router.get("/drying", dryingController.getAllDryings);
router.put("/drying/:id", dryingController.updateDrying);
router.delete("/drying/:id", dryingController.deleteDrying);

// Route สำหรับดึงข้อมูลเดี่ยว (ต้องมาท้ายสุด)
router.get('/drying/:id', dryingController.getDryingById);


module.exports = router;