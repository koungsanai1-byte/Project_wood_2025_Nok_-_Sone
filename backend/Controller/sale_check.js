
const db = require('../Config/db');

// ຕົ້ນທຶນທັງໝົດ
exports.getTotalCost = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        (SELECT IFNULL(SUM(total), 0) FROM shop) 
        +
        (SELECT IFNULL(SUM(total), 0) FROM invoice)
        AS total_cost;
    `);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getTotalProfit = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        (SELECT IFNULL(SUM(total), 0) FROM shop) 
        +
        (SELECT IFNULL(SUM(total), 0) FROM invoice)
        -
        (SELECT IFNULL(SUM(total), 0) FROM purchase)
        AS profit;
    `);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};