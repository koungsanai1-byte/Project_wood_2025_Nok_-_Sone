const db = require('../Config/db');

// ເບິກທັງໝົດ
exports.getrequsitionAll = async (req, res) => {
  try {
    const result = await db.query(`
        SELECT COUNT(*) AS count_all
        FROM requisition
        WHERE status = 'ສັ່ງຜະລິດ';
    `);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ເບີກມື້ນີ້
exports.getrequsitionToday = async (req, res) => {
  try {
    const result = await db.query(`
        SELECT COUNT(*) AS count_today
        FROM requisition
        WHERE amount > 0 AND DATE(created_at) = CURDATE();
    `);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ການຜະລິດທັງໝົດ
exports.getProcessAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT COUNT(*) AS count_all
      FROM process
      WHERE status = 'ກຳລັງຜະລິດ';
    `);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ຜະລິດມື້ນີ້
exports.getProcessToday = async (req, res) => {
  try {
    const result = await db.query(`
        SELECT COUNT(*) AS count_today
        FROM process
        WHERE DATE(created_at) = CURDATE();
    `);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
