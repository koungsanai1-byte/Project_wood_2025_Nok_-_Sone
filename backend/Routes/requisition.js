const express = require("express");
const router = express.Router();
const requisitionController = require("../Controller/requisition");

router.post("/create_requisition", requisitionController.createRequisition);
router.get("/list_requisition", requisitionController.getAllRequisitions);
router.get("/listById_requisition/:id", requisitionController.getRequisitionById);
router.put("/update_requisition/:id", requisitionController.updateRequisition);
router.delete("/delete_requisition/:id", requisitionController.deleteRequisition);

// เพิ่ม route สำหรับ update status
router.put("/update_requisition_status/:id", requisitionController.updateRequisitionStatus);

router.get("/inventory_amount", requisitionController.amount);

module.exports = router;