const db = require('../Config/db');

// ✅ CREATE wholesale
exports.createWholesale = (req, res) => {
  const {
    type_products, size_products, price, amount, total,
    name, lname, phone, province, district, village, alley,
    factory, car_plate, employee, payment_type, delivery_date, status
  } = req.body;

  const sql = `
    INSERT INTO wholesale (
      type_products, size_products, price, amount, total,
      name, lname, phone, province, district, village, alley,
      factory, car_plate, employee, payment_type, delivery_date, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    type_products, size_products, price, amount, total,
    name, lname, phone, province, district, village, alley,
    factory, car_plate, employee, payment_type, delivery_date, status
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error inserting wholesale:', err);
      return res.status(500).json({ error: 'Insert failed' });
    }
    res.status(201).json({ message: '✅ Created successfully', id: result.insertId });
  });
};

// ✅ GET all wholesales
exports.getAllWholesales = (req, res) => {
  const sql = "SELECT * FROM wholesale ORDER BY id_wholesale DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.error('❌ Error fetching wholesales:', err);
      return res.status(500).json({ error: 'Fetch failed' });
    }
    res.json(result);
  });
};

// ✅ GET wholesale by ID
exports.getWholesaleById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM wholesale WHERE id_wholesale = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Fetch by ID failed' });
    if (result.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result[0]);
  });
};

// ✅ DELETE wholesale
exports.deleteWholesale = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM wholesale WHERE id_wholesale = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: '🗑️ Deleted successfully' });
  });
};
