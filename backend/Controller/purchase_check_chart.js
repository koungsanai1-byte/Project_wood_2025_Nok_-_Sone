const db = require('../Config/db');

// ຂໍ້ມູນການຊື້ທັງໝົດ
exports.getTotalPurchase = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT SUM(total) AS total_purchase FROM purchase LIMIT 1
    `);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// ຂໍ້ມູນການຊື້ສະເພາະເດືອນນີ້
exports.getMonthlyPurchase = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT DATE_FORMAT(date_purchase, '%Y-%m') AS month, SUM(total) AS monthly_total
      FROM purchase
      WHERE MONTH(date_purchase) = MONTH(CURDATE()) AND YEAR(date_purchase) = YEAR(CURDATE())LIMIT 1
    `);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ຂໍ້ມູນການຊື້ລ່າສຸດ
exports.getLatestPurchase = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT total, date_purchase
      FROM purchase
      ORDER BY date_purchase DESC
      LIMIT 1
    `);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ດຶງຂໍໍ້ມູນລາຍເດືອນ
exports.getChartData = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        DATE_FORMAT(date_purchase, '%b') AS month,
        SUM(total) AS amount
      FROM purchase 
      WHERE YEAR(date_purchase) = YEAR(CURDATE())
      GROUP BY MONTH(date_purchase), DATE_FORMAT(date_purchase, '%b')
      ORDER BY MONTH(date_purchase)
    `);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
