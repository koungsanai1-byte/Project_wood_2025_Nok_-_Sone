const db = require('../Config/db'); // เปลี่ยน path ตามของจริง

// 🔹 GET: รายการทั้งหมด

exports.getAllShops = async (req, res) => {
  const sql = "SELECT * FROM shop ORDER BY id_shop DESC "
  db.query(sql, (err, result) => {
    if(err) return res.json(err);
    return res.json(result);
  });
};

// ใน shopController.js
exports.getTodaySalesTotal = (req, res) => {
  const sql = `
    SELECT SUM(total) AS total_sales_today
    FROM shop
    WHERE DATE(created_at) = CURDATE()
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result[0]); // { total_sales_today: 123456.789 }
  });
};


exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await db.query('SELECT * FROM shop WHERE id_shop = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching delivery:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
  }
};



// 🔹 POST: เพิ่มรายการขาย
exports.createShop = async (req, res) => {
  console.log(req.body);

  const {
    type_products,
    size_products,
    price,
    amount,
    user_buy,
    note,
    id_products,
    total,
    payment
  } = req.body;

  try {
    // เริ่ม transaction
    await db.beginTransaction();

    // 1) Insert into shop
    const result = await db.query(
      `INSERT INTO shop (type_products, size_products, price, amount, total, user_buy, note, id_products, payment)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [type_products, size_products, price, amount, total, user_buy, note, id_products,payment]
    );

    // 2) Update products stock
    await db.query(
      `UPDATE products
         SET amount_products = amount_products - ?
       WHERE id_products = ?`,
      [amount, id_products]
    );

    // 3) Delete product if out of stock
    await db.query(
      `DELETE FROM products WHERE id_products = ? AND amount_products <= 0`,
      [id_products]
    );

    // commit transaction
    await db.commit();
    res.status(201).json({ message: 'เพิ่มรายการขายสำเร็จ', id: result.insertId });
  } catch (err) {
    // rollback on error
    await db.rollback();
    console.error('Error creating shop:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลหรืออัปเดตคลังสินค้า' });
  }
};

// 🔹 DELETE: ลบรายการและคืน stock
exports.deleteShop = async (req, res) => {
  const { id } = req.params;
  console.log('🔁 START deleteShop id:', id);

  try {
    await db.beginTransaction();
    console.log('✅ BEGIN TRANSACTION');

    // ✅ แก้ไข: ไม่ใช้ destructuring
    const shopRows = await db.query(
      'SELECT id_products, amount FROM shop WHERE id_shop = ?',
      [id]
    );
    console.log('🔍 Shop rows:', shopRows);

    if (!shopRows || shopRows.length === 0) {
      await db.rollback();
      return res.status(404).json({ error: 'ไม่พบรายการขาย' });
    }

    const { id_products, amount } = shopRows[0];
    console.log('🟡 Product ID:', id_products, 'Amount to return:', amount);

    // ลบรายการจาก shop
    await db.query('DELETE FROM shop WHERE id_shop = ?', [id]);
    console.log('🗑️ Deleted from shop');

    // คืน stock ให้ products
    const updateResult = await db.query(
      'UPDATE products SET amount_products = amount_products + ? WHERE id_products = ?',
      [amount, id_products]
    );
    console.log('✅ Updated product stock:', updateResult);

    if (updateResult.affectedRows === 0) {
      console.log('⚠️ Product not found, but continuing...');
      // อาจจะเป็นสินค้าที่ถูกลบไปแล้ว ไม่ต้อง rollback
    }

    await db.commit();
    console.log('✅ COMMIT SUCCESS');
    res.json({ message: 'ลบรายการสำเร็จ และคืน stock แล้ว' });

  } catch (err) {
    await db.rollback();
    console.error('❌ ERROR:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบหรือคืน stock' });
  }
};
