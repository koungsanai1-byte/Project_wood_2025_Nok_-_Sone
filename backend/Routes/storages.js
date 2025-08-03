const express = require("express");
const router = express.Router();
const storageController = require("../Controller/storages");

router.get("/list_storages", storageController.listStorage);
router.post("/create_storages", storageController.createStorage);
router.put("/update_storages/:id", storageController.updateStorage);
router.delete("/delete_storages/:id", storageController.deleteStorage);

module.exports = router;
