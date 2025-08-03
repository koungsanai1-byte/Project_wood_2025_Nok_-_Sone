const db = require('../Config/db');

// Get all type_products
exports.getAllTypeProducts = (req, res) => {
  db.query('SELECT * FROM type_products', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get one Type_product by ID
exports.getTypeProductById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM type_products WHERE id_type_products = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(result[0]);
  });
};

// Create new Type_product
exports.createTypeProduct = (req, res) => {
  const { type_products } = req.body;
  if (!type_products) return res.status(400).json({ message: 'กรุณากรอกชื่อสินค้า' });

  db.query('INSERT INTO type_products (type_products) VALUES (?)', [type_products], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, type_products });
  });
};

// Update Type_product
exports.updateTypeProduct = (req, res) => {
  const { id } = req.params;
  const { type_products } = req.body;

  db.query('UPDATE type_products SET type_products = ? WHERE id_type_products = ?', [type_products, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json({ message: 'อัปเดตข้อมูลเรียบร้อย' });
  });
};

// Delete Type_product
exports.deleteTypeProduct = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM type_products WHERE id_type_products = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json({ message: 'ลบข้อมูลเรียบร้อย' });
  });
};
