const db = require('../Config/db');

// GET all storages_products
exports.getAllStoragesProducts = (req, res) => {
  db.query('SELECT * FROM storages_products', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// GET one by ID
exports.getStoragesProductById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM storages_products WHERE id_storages_products = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(result[0]);
  });
};

// CREATE storages_products
exports.createStoragesProduct = (req, res) => {
  const { storages_products } = req.body;
  if (!storages_products) {
    return res.status(400).json({ message: 'กรุณากรอกชื่อคลัง' });
  }

  db.query('INSERT INTO storages_products (storages_products) VALUES (?)', [storages_products], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, storages_products });
  });
};

// UPDATE storages_products
exports.updateStoragesProduct = (req, res) => {
  const { id } = req.params;
  const { storages_products } = req.body;

  db.query('UPDATE storages_products SET storages_products = ? WHERE id_storages_products = ?', [storages_products, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json({ message: 'อัปเดตข้อมูลเรียบร้อย' });
  });
};

// DELETE storages_products
exports.deleteStoragesProduct = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM storages_products WHERE id_storages_products = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json({ message: 'ลบข้อมูลเรียบร้อย' });
  });
};
