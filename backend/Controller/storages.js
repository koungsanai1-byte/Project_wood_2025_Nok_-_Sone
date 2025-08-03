const db = require("../Config/db");

// 📦 GET: List all storage locations
exports.listStorage = (req, res) => {
  const sql = "SELECT id_storages, name_storages FROM storages ";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
};

// ➕ POST: Create new storage location
exports.createStorage = (req, res) => {
  const { name_storages } = req.body;

  if (!name_storages || name_storages.trim() === "") {
    return res.status(400).json({ error: "name_storages is required" });
  }

  // ตรวจสอบชื่อซ้ำ
  const sql = "SELECT * FROM storages WHERE name_storages = ? ";
  db.query(sql, [name_storages], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.length > 0) {
      return res.status(400).json({ error: "ชื่อบ່ອນຈັດເກັບນີ້ມີແລ້ວ" });
    }

    // ถ้าไม่ซ้ำ → ทำการ insert
    const sql = "INSERT INTO storages (name_storages) VALUES (?) "
    db.query(sql , [name_storages], (err, result) => {
      if (err) return res.status(500).json({ error: "Insert failed" });
      res.json({ message: "Storage created", id: result.insertId });
    });
  });
};



// ✏️ PUT: Update storage by ID
exports.updateStorage = (req, res) => {
  const { id } = req.params;
  const { name_storages } = req.body;

  if (!name_storages || name_storages.trim() === "") {
    return res.status(400).json({ error: "name_storages is required" });
  }

  // ตรวจสอบว่ามีชื่อซ้ำหรือไม่ (ยกเว้น id ปัจจุบัน)
  const checkSql = "SELECT * FROM storages WHERE name_storages = ? AND id_storages != ?";
  db.query(checkSql, [name_storages, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.length > 0) {
      return res.status(400).json({ error: "ชื่อบ່ອນຈັດເກັບນີ້ມີແລ້ວ" });
    }

    // ถ้าไม่ซ้ำ → ทำการ update
    const updateSql = "UPDATE storages SET name_storages = ? WHERE id_storages = ?";
    db.query(updateSql, [name_storages, id], (err, result) => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.json({ message: "Storage updated" });
    });
  });
};


// ❌ DELETE: Delete storage by ID
exports.deleteStorage = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM storages WHERE id_storages = ? "
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ message: "Storage deleted" });
  });
};
