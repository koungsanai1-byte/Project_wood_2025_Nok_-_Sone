const db = require('../Config/db');

// GET all size_products
exports.getAllSizeProducts = (req, res) => {
  const sql = `
    SELECT s.*, t.type_products
    FROM size_products s
    LEFT JOIN type_products t ON s.id_type_products = t.id_type_products
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// GET one size_product by ID
exports.getSizeProductById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM size_products WHERE id_size_products = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(result[0]);
  });
};

// CREATE size_product
exports.createSizeProduct = (req, res) => {
  const { size_products, id_type_products } = req.body;
  if (!size_products || !id_type_products) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
  }

  const sql = 'INSERT INTO size_products (size_products, id_type_products) VALUES (?, ?)';
  db.query(sql, [size_products, id_type_products], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, size_products, id_type_products });
  });
};

// UPDATE size_product
exports.updateSizeProduct = (req, res) => {
  const { id } = req.params;
  const { size_products, id_type_products } = req.body;

  const sql = 'UPDATE size_products SET size_products = ?, id_type_products = ? WHERE id_size_products = ?';
  db.query(sql, [size_products, id_type_products, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json({ message: 'อัปเดตเรียบร้อย' });
  });
};

// DELETE size_product
exports.deleteSizeProduct = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM size_products WHERE id_size_products = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json({ message: 'ลบข้อมูลเรียบร้อย' });
  });
};
