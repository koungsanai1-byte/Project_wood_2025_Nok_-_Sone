const db = require('../Config/db');

// ดึงทั้งหมด
exports.getAllProducts = (req, res) => {
  const sql = `
    SELECT 
      p.*, 
      t.type_products, 
      s.size_products, 
      st.storages_products 
    FROM products p
    LEFT JOIN type_products t ON p.id_type_products = t.id_type_products
    LEFT JOIN size_products s ON p.id_size_products = s.id_size_products
    LEFT JOIN storages_products st ON p.id_storages_products = st.id_storages_products
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// ดึงตาม id
exports.getProductById = (req, res) => {
  const { id } = req.params;
const sql = `
  SELECT 
    p.*,
    t.type_products, 
    s.size_products,
    st.storages_products
  FROM products p
  LEFT JOIN type_products t ON p.id_type_products = t.id_type_products
  LEFT JOIN size_products s ON p.id_size_products = s.id_size_products
  LEFT JOIN storages_products st ON p.id_storages_products = st.id_storages_products
  WHERE p.id_products = ?
`;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(result[0]);
  });
};


// ✅ CREATE Product: Check duplicates by type + size + storage
exports.createProduct = (req, res) => {
  const {
    amount_products,
    price_products,
    note,
    id_type_products,
    id_size_products,
    id_storages_products
  } = req.body;

  if (!price_products || !id_type_products || !id_size_products || !id_storages_products) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
  }

  // 🔍 Check for duplicates
  const checkSql = `
    SELECT * FROM products 
    WHERE id_type_products = ? AND id_size_products = ? AND id_storages_products = ?
  `;

  db.query(checkSql, [id_type_products, id_size_products, id_storages_products], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length > 0) {
      return res.status(409).json({ message: 'ສິນຄ້ານີ້ມີຢູ່ແລ້ວ' });
    }

    // ✅ Insert new product
    const insertSql = `
      INSERT INTO products (amount_products, price_products, note, id_type_products, id_size_products, id_storages_products)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      insertSql,
      [amount_products || 0, price_products, note, id_type_products, id_size_products, id_storages_products],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'เพิ่มข้อมูลสินค้าใหม่เรียบร้อย', id: result.insertId });
      }
    );
  });
};


// อัปเดตข้อมูล
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { amount_products, price_products, note, id_type_products, id_size_products, id_storages_products } = req.body;

  const sql = `
    UPDATE products 
    SET amount_products = ?, price_products = ?, note = ?, id_type_products = ?, id_size_products = ?, id_storages_products = ?
    WHERE id_products = ?
  `;
  db.query(sql, [amount_products, price_products, note, id_type_products, id_size_products, id_storages_products, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json({ message: 'อัปเดตเรียบร้อย' });
  });
};

// ลบข้อมูล
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id_products = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json({ message: 'ลบข้อมูลเรียบร้อย' });
  });
};
