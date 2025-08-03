// inventoryController.js

// Controller/inventory.js
const db = require("../Config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

// Helper function to update inventory status based on amount
const updateInventoryStatus = async (id_inventory) => {
  try {
    const inventoryData = await query(
      `SELECT amount FROM inventory WHERE id_inventory = ?`,
      [id_inventory]
    );
    
    if (inventoryData.length > 0) {
      const amount = inventoryData[0].amount;
      const status = amount === 0 ? 'ບໍ່ມີຈຳນວນ' : 'ພ້ອມໄຫ້ເບີກ';
      
      await query(
        `UPDATE inventory SET status = ? WHERE id_inventory = ?`,
        [status, id_inventory]
      );
    }
  } catch (error) {
    console.error('Error updating inventory status:', error);
  }
};

// Create or update inventory
exports.createInventory = async (req, res) => {
  console.log(req.body);
  try {
    const {
      id_purchase,
      id_storages,
      note,
      amount,
      name,
      type,
      size,
      volume,
      u_request
    } = req.body;

    if (!id_purchase || !id_storages || !name || !type || !size || !amount || !volume) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({ message: "Amount must be a valid number" });
    }

    let inventoryId;

    // Check if this item already exists
    const checkSql = `
      SELECT id_inventory, amount 
      FROM inventory 
      WHERE name = ? AND type = ? AND size = ? AND id_storages = ? AND volume = ?
    `;
    const existing = await query(checkSql, [name, type, size, id_storages, volume]);

    if (existing.length > 0) {
      // Update existing inventory
      const existingEntry = existing[0];
      const newAmount = existingEntry.amount + parsedAmount;
      const updateSql = `
        UPDATE inventory 
        SET amount = ?, u_request = ?, note = ? 
        WHERE id_inventory = ?
      `;
      await query(updateSql, [
        newAmount,
        u_request || "",
        note || "",
        existingEntry.id_inventory,
      ]);
      inventoryId = existingEntry.id_inventory;
    } else {
      // Insert new inventory
      const insertSql = `
        INSERT INTO inventory 
        (id_purchase, id_storages, u_import, note, amount, name, type, size, volume, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await query(insertSql, [
        id_purchase,
        id_storages,
        u_request,
        note || "",
        parsedAmount,
        name,
        type,
        size,
        volume,
        parsedAmount > 0 ? 'ພ້ອມໄຫ້ເບີກ' : 'ບໍ່ມີຈຳນວນ'
      ]);
      inventoryId = result.insertId;
    }

    // Update inventory status
    await updateInventoryStatus(inventoryId);

    // Update purchase status
    await query(
      `UPDATE purchase SET status = 'ຈັດເກັບແລ້ວ' WHERE id_purchase = ?`,
      [id_purchase]
    );

    res.status(200).json({ message: "Inventory processed successfully" });
  } catch (error) {
    console.error("Error creating inventory:", error);
    res.status(500).json({ message: "Failed to create inventory", error });
  }
};

// ✅ Get all inventory
exports.getAllInventory = (req, res) => {
  const sql = `
    SELECT 
      i.id_inventory, i.amount, i.u_import, i.note, i.status,
      p.id_purchase, i.name, i.type, i.size, i.volume,
      st.name_storages
    FROM inventory i
    JOIN purchase p ON i.id_purchase = p.id_purchase
    JOIN storages st ON i.id_storages = st.id_storages
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// ✅ Get inventory by ID
exports.getInventoryById = (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT 
      i.id_inventory, i.amount, i.u_import, i.note, i.volume, i.status,
      i.id_purchase, i.id_storages, i.name, i.type, i.size,
      st.name_storages
    FROM inventory i
    JOIN storages st ON i.id_storages = st.id_storages
    WHERE id_inventory = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (results.length === 0)
      return res.status(404).json({ error: "Inventory not found" });
    res.json(results[0]);
  });
};

// ✅ Update inventory by ID
exports.updateInventory = async (req, res) => {
  const id = req.params.id;
  const {
    id_purchase,
    id_storages,
    u_request,
    note,
    amount,
    name,
    type,
    size,
    volume
  } = req.body;

  if (!id_purchase || !id_storages || !amount || !name || !type || !size) {
    return res.status(400).json({
      error:
        "id_purchase, id_storages, amount, name, type, and size are required",
    });
  }

  try {
    const sql = `
      UPDATE inventory
      SET id_purchase = ?, id_storages = ?, u_import = ?, note = ?, amount = ?, name = ?, type = ?, size = ?, volume = ?
      WHERE id_inventory = ?
    `;

    const result = await query(sql, [
      id_purchase,
      id_storages,
      u_request || null,
      note || null,
      amount,
      name,
      type,
      size,
      volume || null,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Inventory not found" });
    }

    // Update inventory status after update
    await updateInventoryStatus(id);

    res.json({ message: "Inventory updated successfully" });
  } catch (err) {
    console.error("DB error updating inventory:", err);
    return res.status(500).json({ error: "Failed to update inventory" });
  }
};

// ✅ Delete inventory by ID
exports.deleteInventory = (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM inventory WHERE id_inventory = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete inventory" });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Inventory not found" });
    res.json({ message: "Inventory deleted successfully" });
  });
};

// ✅ Get inventory with amounts for requisition (only available items)
exports.getInventoryAmount = (req, res) => {
  const sql = `
    SELECT 
      i.id_inventory, i.amount, i.name, i.type, i.size, i.volume, i.status,
      st.name_storages
    FROM inventory i
    JOIN storages st ON i.id_storages = st.id_storages
    WHERE i.amount > 0 AND i.status = 'ພ້ອມໄຫ້ເບີກ'
    ORDER BY i.name, i.type, i.size
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Function to update inventory amount after requisition
exports.updateInventoryAfterRequisition = async (id_inventory, requestedAmount) => {
  try {
    // Get current amount
    const currentData = await query(
      `SELECT amount FROM inventory WHERE id_inventory = ?`,
      [id_inventory]
    );

    if (currentData.length === 0) {
      throw new Error('Inventory not found');
    }

    const currentAmount = currentData[0].amount;
    const newAmount = currentAmount - requestedAmount;

    if (newAmount < 0) {
      throw new Error('Insufficient inventory amount');
    }

    // Update amount
    await query(
      `UPDATE inventory SET amount = ? WHERE id_inventory = ?`,
      [newAmount, id_inventory]
    );

    // Update status based on new amount
    await updateInventoryStatus(id_inventory);

    return { success: true, newAmount };
  } catch (error) {
    console.error('Error updating inventory after requisition:', error);
    throw error;
  }
};