const express = require("express");
const router = express.Router();
const processController = require("../Controller/process");

router.post("/create_process", processController.createProcess);
router.get("/list_process_x", processController.getAllProcesses);
router.get("/listById_process/:id", processController.getProcessById);
router.put("/update_process/:id", processController.updateProcess);
router.delete("/delete_process/:id", processController.deleteProcess);
router.put("/update_amount/:id/update_amount_and_status", processController.updateAmountAndStatus);




module.exports = router;
