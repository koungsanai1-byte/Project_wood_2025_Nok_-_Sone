const db = require("../Config/db"); // สมมติว่า db คือ mysql connection หรือ pool

exports.createProcess = async (req, res) => {
  const {
    type_products,
    size_products,
    amount_products,
    note,
    name,
    type,
    size,
    volume,
    amount,
    id_requisition,
    u_request,
  } = req.body;

  if (
    !type_products ||
    !size_products ||
    amount_products == null ||
    !name ||
    !type ||
    !volume ||
    amount == null
  ) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    await db.beginTransaction();

    // insert process
    const sqlInsert = `
      INSERT INTO process 
      (type_products, size_products, amount_products, note, name, type, size, volume, amount, id_requisition, user, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      type_products,
      size_products,
      amount_products,
      note,
      name,
      type,
      size,
      volume,
      amount,
      id_requisition || null,
      u_request,
      "ກຳລັງຜະລິດ",
    ];

    const result = await db.query(sqlInsert, values);

    // ถ้ามี id_requisition ให้ update amount เป็น 0
    // if (id_requisition) {
    //   await db.query(
    //     "UPDATE requisition SET amount = 0 WHERE id_requisition = ?",
    //     [id_requisition]
    //   );
    // }

    await db.commit();

    res.status(201).json({ message: "สร้างกระบวนการสำเร็จ", id_process: result.insertId });
  } catch (err) {
    console.error("❌ CREATE ERROR:", err);
    try {
      await db.rollback();
    } catch (rollbackErr) {
      console.error("Rollback error:", rollbackErr);
    }
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการสร้างกระบวนการ" });
  }
};



// ✅ READ ALL: ดึงข้อมูลกระบวนการทั้งหมด
exports.getAllProcesses = async (req, res) => {
  const sql = "SELECT * FROM process ORDER BY id_process DESC"
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
};

// ✅ READ BY ID: ดึงข้อมูลกระบวนการตาม ID
exports.getProcessById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM process WHERE id_process = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลกระบวนการนี้" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ READ BY ID ERROR:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
};

// ✅ UPDATE: อัปเดตข้อมูลกระบวนการ
exports.updateProcess = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type_products,
      size_products,
      amount_products,
      note,
      name,
      type,
      size,
      volume,
      amount,
      id_requisition,
      status,
      u_request
    } = req.body;

    if (
      !type_products ||
      !size_products ||
      amount_products == null || // รองรับ 0
      !name ||
      !type ||
      !size ||
      !volume ||
      amount == null || // รองรับ 0
      !id_requisition
    ) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const noteValue = note || "";

    const [result] = await db.query(
      `UPDATE process SET 
        type_products = ?, 
        size_products = ?, 
        amount_products = ?, 
        note = ?, 
        name = ?, 
        type = ?, 
        size = ?, 
        volume = ?, 
        amount = ?, 
        id_requisition = ?,
        status = ?
        user = ?
      WHERE id_process = ?`,
      [
        type_products,
        size_products,
        amount_products,
        note,
        name,
        type,
        size,
        volume,
        amount,
        u_request,
        id_requisition,
        status || "ผลิตสำเร็จ",
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลกระบวนการนี้" });
    }

    res.json({ message: "อัปเดตกระบวนการสำเร็จ" });
  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
};

// ✅ DELETE: ลบกระบวนการตาม ID
exports.deleteProcess = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM process WHERE id_process = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลกระบวนการนี้" });
    }
    res.json({ message: "ลบกระบวนการสำเร็จ" });
  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
  }
};


exports.updateAmountAndStatus = async (req, res) => {
  const { id } = req.params;
  const { amount_products } = req.body;

  if (amount_products == null) {
    return res.status(400).json({ message: "amount_products ต้องไม่เป็นค่าว่าง" });
  }

  try {
    // Do not destructure if db.query returns only result
    const result = await db.query(
      "UPDATE process SET amount_products = ? WHERE id_process = ?",
      [amount_products, id]
    );

    // For mysql package, result.affectedRows is directly available
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูล process นี้" });
    }

    if (Number(amount_products) !== 0) {
      await db.query(
        "UPDATE process SET status = ? WHERE id_process = ?",
        ["ພ້ອມອົບ", id]
      );
    }

    res.json({ message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
};


