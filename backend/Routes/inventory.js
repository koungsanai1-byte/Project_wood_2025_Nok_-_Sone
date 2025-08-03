const express = require("express");
const router = express.Router();
const inventory = require("../Controller/inventory");

router.post("/create_inventory", inventory.createInventory);
router.get("/list_inventory", inventory.getAllInventory);
router.get("/listById_inventory/:id", inventory.getInventoryById);
router.put("/update_inventory/:id", inventory.updateInventory);
router.delete("/delete_inventory/:id", inventory.deleteInventory);



module.exports = router;
