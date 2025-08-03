// controllers/inventoryController.js
const db = require('../Config/db');

// 1. จำนวนสินค้าทั้งหมด
exports.getTotalAmount = async (req, res) => {
    try {
        const result = await db.query('SELECT SUM(amount) AS total FROM inventory');
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// 2. รายชื่อ volume ทั้งหมดที่มี (ไม่ซ้ำ)
exports.getAllVolumes = async (req, res) => {
    try {
        const result = await db.query(`
      SELECT COUNT(DISTINCT volume) AS distinct_volume_count
        FROM inventory
            WHERE volume IS NOT NULL AND volume != '';
    `);
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};




