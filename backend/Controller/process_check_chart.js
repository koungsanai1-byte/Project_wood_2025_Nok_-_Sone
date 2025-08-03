const db = require('../Config/db'); // ปรับ path ตามจริง

// สรุปจำนวน amount ทั้งหมด
exports.getTotalAmount = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT SUM(amount) AS total_amount FROM process
    `);
    res.json(result[0]); // { total_amount: 123 }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// สรุปจำนวน amount ของเดือนปัจจุบัน
exports.getMonthlyAmount = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT SUM(amount) AS monthly_amount
      FROM process
      WHERE MONTH(created_at) = MONTH(CURDATE())
        AND YEAR(created_at) = YEAR(CURDATE())
    `);
    res.json(result[0]); // { monthly_amount: 45 }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// จำนวน amount ล่าสุด (จากรายการล่าสุดที่สร้าง)
exports.getLatestAmount = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT amount, created_at
      FROM process
      ORDER BY created_at DESC
      LIMIT 1
    `);
    res.json(result[0] || null); // { amount: 10, created_at: '...' } หรือ null ถ้าไม่มีข้อมูล
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getChartData = async (req, res) => {
  try {
    const result = await db.query(`
    SELECT 
      DATE_FORMAT(created_at, '%b') AS month,
      SUM(amount) AS amount
      FROM process
      WHERE YEAR(created_at) = YEAR(CURDATE())
      GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%b')
      ORDER BY MONTH(created_at);
    `);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};