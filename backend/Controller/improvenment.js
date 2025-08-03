const db = require('../Config/db');

// สร้างข้อมูล improvement
exports.createImprovement = async (req, res) => {
  console.log(req.body)
  const {
    type_inspection,
    size,
    amount_inspection,
    amount_update,
    note,
    id_inspection,
     u_request
  } = req.body;

  // ตรวจสอบว่าไม่ให้ amount_update เกินจำนวนที่ตรวจสอบ
  if (amount_update > amount_inspection) {
    return res.status(400).json({ error: 'จำนวนที่ปรับปรุงเกินจำนวนที่ตรวจสอบ' });
  }

  const amount_not_fix = amount_inspection - amount_update;

  try {
    await db.beginTransaction();

    // ไม่ใช้ destructuring แบบ [rows] เพราะ mysql ปกติคืน object เดียว
    const inspect = await db.query(
      'SELECT * FROM inspection WHERE id_inspection = ?',
      [id_inspection]
    );

    if (!inspect || inspect.length === 0) {
      await db.rollback();
      return res.status(404).json({ error: 'ไม่พบข้อมูลการตรวจสอบที่เลือก' });
    }

    // เพิ่มข้อมูลการปรับปรุง
    const sqlInsert = `
      INSERT INTO improvement
      (type_inspection, size, amount_inspection, amount_update, amount_not_fix, note, status, id_inspection,user)
      VALUES (?, ?, ?, ?, ?, ?, 'ປັບປຸງແລ້ວ', ?, ?)
    `;

    const insertResult = await db.query(sqlInsert, [
      type_inspection,
      size,
      amount_inspection,
      amount_update,
      amount_not_fix,
      note,
      id_inspection,
       u_request
    ]);

    // อัปเดตสถานะใน inspection
    await db.query(
      `UPDATE inspection SET status = 'ປັບປຸງແລ້ວ' WHERE id_inspection = ?`,
      [id_inspection]
    );

    await db.commit();

    res.status(201).json({
      message: 'เพิ่มข้อมูลปรับปรุงสำเร็จ',
      id: insertResult.insertId, // จะใช้ได้ถ้า mysql version คืน insertId
    });
  } catch (err) {
    await db.rollback();
    console.error('CREATE IMPROVEMENT ERROR:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล' });
  }
};


// routes/improvement/list_checked.js หรือคล้ายกัน


exports.list_checked = async (req, res) => {
  try {
    const sql = `
      SELECT 
        i.id_improvement,
        i.type_inspection,
        i.size,
        i.amount_inspection,
        i.amount_update,
        i.amount_not_fix,
        i.note,
        ins.status AS inspection_status,
        ins.id_inspection
      FROM 
        improvement i
      JOIN 
        inspection ins ON i.id_inspection = ins.id_inspection
      WHERE 
        ins.status = 'ກວດສອບ'
      ORDER BY 
        i.id_improvement DESC
    `;
    const results = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Error fetching improvement list:', err);
    res.status(500).json({ error: 'ไม่สามารถโหลดข้อมูลการปรับปรุงได้' });
  }
}





// ดึงรายการทั้งหมด
exports.getAllImprovements = (req, res) => {
  db.query('SELECT * FROM improvement ORDER BY id_imporvement DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'ดึงข้อมูลไม่สำเร็จ' });
    res.json(results);
  });
};

// ดึงตาม id
exports.getImprovementById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM improvement WHERE id_imporvement = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    if (results.length === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(results[0]);
  });
};

// แก้ไข
exports.updateImprovement = (req, res) => {
  const { id } = req.params;
  const { type_inspection, size, amount_inspection, amount_update, note, status, id_inspection } = req.body;

  const sql = `
    UPDATE improvement 
    SET type_inspection = ?, size = ?, amount_inspection = ?, amount_update = ?, note = ?, status = ?, id_inspection = ?
    WHERE id_imporvement = ?
  `;
  db.query(sql, [type_inspection, size, amount_inspection, amount_update, note, status, id_inspection, id], (err) => {
    if (err) return res.status(500).json({ error: 'อัปเดตข้อมูลไม่สำเร็จ' });
    res.json({ message: 'อัปเดตข้อมูลเรียบร้อยแล้ว' });
  });
};

// ลบ
exports.deleteImprovement = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM improvement WHERE id_imporvement = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'ลบข้อมูลไม่สำเร็จ' });
    res.json({ message: 'ลบข้อมูลเรียบร้อยแล้ว' });
  });
};
