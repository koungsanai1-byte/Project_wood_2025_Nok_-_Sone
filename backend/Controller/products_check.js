const db = require('../Config/db');

// 1. ຈຳນວນສຶນຄ້າ
exports.countAllProducts = async (req, res) => {
  try {
    const result = await db.query(`SELECT COUNT(*) AS total FROM products`);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 2.ຈຳນວນສຶນຄ້າຍັງນ້ອຍ
exports.countLowStockProducts = async (req, res) => {
  try {
    const result = await db.query(`SELECT COUNT(*) AS min_stock FROM products WHERE amount_products < 20`);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
