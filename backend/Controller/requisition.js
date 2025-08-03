// Controller/requisition.js

const pool = require("../Config/db");

const db = require('../Config/db');
exports.createRequisition = async (req, res) => {
  console.log(req.body);
  const {
    id_inventory,
    u_request,
    amount,
    note,
    name,
    type,
    size,
    name_storages,
    volume
  } = req.body;

  if (!id_inventory || !u_request || amount === undefined || !volume) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
  }

  try {
    await db.beginTransaction();

    // ตรวจสอบว่ามีรายการที่เหมือนกันอยู่แล้วหรือไม่
    const existing = await db.query(
      `SELECT id_requisition, amount FROM requisition 
       WHERE id_inventory = ? AND user = ? AND note = ? AND name = ? 
       AND type = ? AND size = ? AND storages = ? AND volume = ?`,
      [id_inventory, u_request, note, name, type, size, name_storages, volume]
    );

    let result;
    let newStatus = amount > 0 ? "ສັ່ງຜະລິດ" : "ບໍ່ມີຈຳນວນ";

    if (existing.length > 0) {
      const existingReq = existing[0];
      const newAmount = existingReq.amount + amount;

      await db.query(
        `UPDATE requisition 
         SET amount = ?, status = ? 
         WHERE id_requisition = ?`,
        [newAmount, newAmount > 0 ? "ສັ່ງຜະລິດ" : "ບໍ່ມີຈຳນວນ", existingReq.id_requisition]
      );

      result = { insertId: existingReq.id_requisition };
    } else {
      result = await db.query(
        `INSERT INTO requisition 
         (id_inventory, user, amount, note, name, type, size, storages, volume, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_inventory, u_request, amount, note, name, type, size, name_storages, volume, newStatus]
      );
    }

    // อัปเดตสต็อก inventory ถ้าจำนวน > 0
    if (amount > 0) {
      await db.query(
        `UPDATE inventory SET amount = amount - ? WHERE id_inventory = ?`,
        [amount, id_inventory]
      );
    }

    await db.commit();

    res.status(201).json({
      message: existing.length > 0 ? "อัปเดตคำขอเบิกสำเร็จ" : "สร้างคำขอเบิกสำเร็จ",
      id_requisition: result.insertId,
    });
  } catch (err) {
    console.error("Create Requisition Error:", err);
    try {
      await db.rollback();
    } catch (rollbackErr) {
      console.error("Rollback Error:", rollbackErr);
    }
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};



// ดึง requisition ทั้งหมด (ส่งข้อมูลเป็น Array ตรง ๆ)
exports.getAllRequisitions = (req, res) => {
  const sql = `
    SELECT *
    FROM requisition 
    ORDER BY id_requisition DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
    // result เป็น Array ของ rows อยู่แล้ว
    return res.json(result);
  });
};

// ดึง requisition ตาม id
exports.getRequisitionById = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM requisition WHERE id_requisition = ?",
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "ไม่พบคำขอเบิกนี้" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
};

// อัพเดต requisition (แก้ไขข้อมูล + ปรับ stock inventory)
exports.updateRequisition = async (req, res) => {
  const id = req.params.id;
  const {
    id_inventory,
    u_request,
    amount,
    note,
    name,
    type,
    size,
    name_storages,
  } = req.body;

  if (!id_inventory || !u_request || !amount) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // ดึง requisition เดิมเพื่อดูจำนวนเดิม และ id_inventory เดิม
      const [oldRows] = await conn.query(
        "SELECT * FROM requisition WHERE id_requisition = ? FOR UPDATE",
        [id]
      );

      if (oldRows.length === 0) {
        await conn.rollback();
        return res.status(404).json({ message: "ไม่พบคำขอเบิกนี้" });
      }

      const oldRequisition = oldRows[0];

      // ถ้า id_inventory เปลี่ยน หรือ amount เปลี่ยน ต้องคืน stock เก่า และเช็ค stock ใหม่
      if (
        oldRequisition.id_inventory !== id_inventory ||
        oldRequisition.amount !== amount
      ) {
        // คืน stock เก่า
        await conn.query(
          "UPDATE inventory SET amount = amount + ? WHERE id_inventory = ?",
          [oldRequisition.amount, oldRequisition.id_inventory]
        );

        // เช็ค stock ใหม่
        const [newInventoryRows] = await conn.query(
          "SELECT amount FROM inventory WHERE id_inventory = ? FOR UPDATE",
          [id_inventory]
        );
        if (newInventoryRows.length === 0) {
          await conn.rollback();
          return res.status(404).json({ message: "ไม่พบสินค้าคงคลังใหม่" });
        }

        const newStock = newInventoryRows[0].amount;
        if (newStock < amount) {
          await conn.rollback();
          return res.status(400).json({
            message: `จำนวนที่ขอเบิกเกินกว่าคงเหลือ (คงเหลือ: ${newStock})`,
          });
        }

        // ลด stock ใหม่
        await conn.query(
          "UPDATE inventory SET amount = amount - ? WHERE id_inventory = ?",
          [amount, id_inventory]
        );
      }

      // อัพเดต requisition
      await conn.query(
        `UPDATE requisition SET
          id_inventory = ?,
          user = ?,
          amount = ?,
          note = ?,
          name = ?,
          type = ?,
          size = ?,
          storages = ?
         WHERE id_requisition = ?`,
        [id_inventory, u_request, amount, note, name, type, size, name_storages, id]
      );

      await conn.commit();
      conn.release();

      res.json({ message: "แก้ไขคำขอเบิกสำเร็จ" });
    } catch (err) {
      await conn.rollback();
      conn.release();
      console.error(err);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เชื่อมต่อฐานข้อมูลล้มเหลว" });
  }
};

// อัพเดต status ของ requisition
exports.updateRequisitionStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "กรุณาระบุ status" });
  }

  try {
    const result = await db.query(
      "UPDATE requisition SET status = ? WHERE id_requisition = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบคำขอเบิกนี้" });
    }

    res.json({ message: "อัพเดต status สำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัพเดต status" });
  }
};

// ลบ requisition และคืน stock inventory
exports.deleteRequisition = (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  db.query(
    "DELETE FROM requisition WHERE id_requisition = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("SQL error:", err);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
      }

      res.json(result);
    }
  );
};

exports.amount = (req, res) => {
  const sql = `
    SELECT 
      i.id_inventory, i.amount, i.u_import, i.note,i.volume,
      p.id_purchase, i.name, i.type, i.size,
      st.name_storages
    FROM inventory i
    JOIN purchase p ON i.id_purchase = p.id_purchase
    JOIN storages st ON i.id_storages = st.id_storages
    WHERE i.amount > 0
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};