const db = require('../Config/db'); 

// 🔹 GET: ລາຍການທັງໝົດທີ່ຕິດໜີ້
exports.getAllShops = async (req, res) => {
  const sql = "SELECT * FROM invoice WHERE payment = 'ຕິດໜີ້' ORDER BY id_invoices DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("ຜິດພາດໃນການເອົາຂໍ້ມູນ:", err);
      return res.status(500).json({ error: "ເກີດຂໍ້ຜິດພາດໃນການເອົາຂໍ້ມູນ" });
    }
    return res.json(result);
  });
};

// ເອົາຂໍ້ມູນຫນີ້ຈາກ invoice ກັບ debts ຂອງໃບບິນ
exports.get_debt = async (req, res) => {
  const sql = "SELECT a.id_invoices, b.* FROM invoice as a, debts as b WHERE a.id_invoices = b.id_invoices";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("ຜິດພາດໃນການເອົາຂໍ້ມູນໜີ້:", err);
      return res.status(500).json({ error: "ເກີດຂໍ້ຜິດພາດໃນການເອົາຂໍ້ມູນ" });
    }
    return res.json(result);
  });
};

// ສ້າງ ຫຼື ອັບເດດ ການຈ່າຍຫນີ້
exports.create_debt = async (req, res) => {
  const { id_invoices, pay_amount, note } = req.body;
  console.log("ຂໍ້ມູນທີ່ຮັບມາ:", req.body);

  try {
    // ກວດສອບວ່າໄດ້ມີໃບບິນນີ້ໃນ debts ຫຼືຍັງ
    const rows = await db.query("SELECT pay_amount FROM debts WHERE id_invoices = ?", [id_invoices]);

    if (rows.length > 0) {
      // ມີແລ້ວ ກວດຈໍານວນເງິນຈ່າຍເກົ່າ ແລະ ເພີ່ມຈໍານວນເງິນໃໝ່
      const oldPayAmount = parseFloat(rows[0].pay_amount);
      const newPayAmount = oldPayAmount + parseFloat(pay_amount);

      await db.query(
        `UPDATE debts SET pay_amount = ?, note = ?, pay_date = CURRENT_TIMESTAMP WHERE id_invoices = ?`,
        [newPayAmount, note, id_invoices]
      );

      res.json({ message: "ອັບເດດການຈ່າຍຫນີ້ໃຫ້ສໍາເລັດແລ້ວ" });

    } else {
      // ຍັງບໍ່ມີຂໍ້ມູນ ສ້າງລາຍການໃໝ່
      await db.query(
        `INSERT INTO debts (id_invoices, pay_amount, note) VALUES (?, ?, ?)`,
        [id_invoices, pay_amount, note]
      );

      res.json({ message: "ເພີ່ມການຈ່າຍຫນີ້ໃຫ້ສໍາເລັດ" });
    }
  } catch (err) {
    console.error("ຜິດພາດໃນການບັນທຶກ/ອັບເດດ:", err);
    res.status(500).json({ error: "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ/ອັບເດດ" });
  }
};
