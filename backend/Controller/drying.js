const db = require("../Config/db");

// ສ້າງ dring ໄໝ່ເວລາກອກ process amount
exports.createDrying = async (req, res) => {
  console.log(req.body);
  const { type_drying, size_drying, amount_drying, note, id_process, u_request } = req.body;

  if (!type_drying || !size_drying || !amount_drying) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    await db.beginTransaction();

    // ບັນທຶກເວລາເລີ່ມຕົ້ນ
    const time_start = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sqlInsertDrying = `
      INSERT INTO drying (type_drying, size_drying, amount_drying, note, id_process, status, time_start, user)
      VALUES (?, ?, ?, ?, ?, 'ກຳລັງອົບ', ?, ?)
    `;
    const result = await db.query(sqlInsertDrying, [type_drying, size_drying, amount_drying, note, id_process, time_start, u_request]);

    // ອັບເດດ process status เป็น 'ສົ່ງອົບແລ້ວ'
    const sqlUpdateProcess = `
      UPDATE process 
      SET status = 'ສົ່ງອົບແລ້ວ' 
      WHERE id_process = ?
    `;
    await db.query(sqlUpdateProcess, [id_process]);

    await db.commit();
    res.status(201).json({ 
      message: "ສ້າງ dring ສຳເລັດ", 
      id_drying: result.insertId,
      status: "ກຳລັງອົບ",
      time_start: time_start
    });

  } catch (err) {
    await db.rollback();
    console.error("Error creating drying:", err);
    res.status(500).json({ error: "ເກີດບັນຫາ" });
  }
};

exports.confirmDryingDone = async (req, res) => {
  const { id } = req.params;
  
  try {
    // ບັນທຶກເລລາສິ້ນສຸດ
    const time_end = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sql = `
      UPDATE drying 
      SET status = 'ກວດສອບ', time_end = ?
      WHERE id_drying = ? AND status = 'ກຳລັງອົບ'
    `;

    // ✅ แก้ไข: เอา destructuring ออก
    const result = await db.query(sql, [time_end, id]);
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "ไม่สามารถอัปเดตสถานะได้ หรือสถานะไม่ตรง" });
    }
    
    res.json({ 
      message: "ອົບສຳເລັດ! ອັດເດດເປັນ 'ກວດສອບ' ສຳເລັດແລ້ວ",
      status: "ກວດສອບ",
      time_end: time_end
    });
    
  } catch (err) {
    console.error("Error confirming drying done:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" });
  }
};

// อัปเดตสถานะจาก 'ກຳລັງອົບ' เป็น 'ພ້ອມກວດສອບ' และบันทึกเวลาเสร็จ (ถ้าต้องการใช้)
exports.updateDryingStatusReady = async (req, res) => {
  const { id } = req.params;
  const time_end = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const sql = `
    UPDATE drying 
    SET status = 'ພ້ອມກວດສອບ', time_end = ?
    WHERE id_drying = ? AND status = 'ກຳລັງອົບ'
  `;

  try {
    // ✅ ແກ້ໄຂ: ເອົາ destructuring ອອກ
    const result = await db.query(sql, [time_end, id]);
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "ไม่สามารถอัปเดตสถานะได้ หรือสถานะไม่ตรง" });
    }
    
    res.json({ 
      message: "ອັບເດດເປັນ 'ພ້ອມກວດສອບ' ສຳເລັດແລ້ວ",
      status: "ພ້ອມກວດສອບ",
      time_end: time_end
    });
    
  } catch (err) {
    console.error("Error updating drying status:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" });
  }
};



exports.getDryingById = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM drying WHERE id_drying = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(results[0]);
  });
};

// ดึงข้อมูล drying ทั้งหมด
exports.getAllDryings = (req, res) => {
  const sql = "SELECT * FROM drying ORDER BY id_drying DESC";

  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
    res.json(rows);
  });
};

// อัพเดต drying โดย id (แก้ไขให้ตรงกับ database schema)
exports.updateDrying = (req, res) => {
  const id = req.params.id;
  const { type_drying, size_drying, amount_drying, note, id_process } = req.body;

  const sql = `
    UPDATE drying SET
      type_drying = ?,
      size_drying = ?,
      amount_drying = ?,
      note = ?,
      id_process = ?
    WHERE id_drying = ?
  `;

  db.query(sql, [type_drying, size_drying, amount_drying, note, id_process, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัพเดตข้อมูล" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ไม่พบ drying ที่จะอัพเดต" });
    }
    res.json({ message: "อัพเดต drying สำเร็จ" });
  });
};

// ลบ drying โดย id
exports.deleteDrying = (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM drying WHERE id_drying = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ไม่พบ drying ที่จะลบ" });
    }
    res.json({ message: "ลบ drying สำเร็จ" });
  });
};

exports.getProcessByIdForDrying = (req, res) => {
  const id_process = req.params.id_process;

  const sql = `
    SELECT id_process, type_products, size_products, amount_products, status
    FROM process
    WHERE id_process = ? AND status = 'ພ້ອມອົບ'
  `;

  db.query(sql, [id_process], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล process" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "ไม่พบ process หรือสถานะไม่ตรงกัน" });
    }

    res.json(results[0]);
  });
};

// ดึง list process ทั้งหมดที่ status = 'ພ້ອມອົບ' (ใช้ในฟรอนต์โหลด dropdown)
exports.getProcessListReady = (req, res) => {
  const sql = `SELECT id_process, type_products, size_products FROM process WHERE status = 'ພ້ອມອົບ' ORDER BY id_process DESC`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึง list process" });
    }
    res.json(results);
  });
};