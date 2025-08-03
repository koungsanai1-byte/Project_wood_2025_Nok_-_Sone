const db = require('../Config/db');


exports.getTotalCost = (req, res) => {
    const sql = "SELECT SUM(total) AS total FROM purchase";
    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result[0]);
    });
};


// Monthly purchase cost summary
exports.getMonthlyCost = (req, res) => {
    const sql = `
    SELECT 
      DATE_FORMAT(date_purchase, '%Y-%m') AS month,
      SUM(total) AS total_cost
      FROM purchase
      GROUP BY month
      ORDER BY month DESC
      LIMIT 1
  `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(result[0]); // ✅ ส่งแค่เดือนล่าสุด
    });
};

// Latest purchase cost per name-type-size

exports.getLatestPurchaseCost = (req, res) => {
    const sql = `
    SELECT 
    total
    FROM purchase
    ORDER BY id_purchase DESC
    LIMIT 1;
  `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(result[0]); // ✅ ส่งแค่เดือนล่าสุด
    });
};


exports.amount_y = (req, res) => {
    const sql = "SELECT SUM(amount) AS amount FROM purchase";
    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result[0]);
    });
};

exports.amount_m = (req, res) => {
    const sql = `
    SELECT 
      DATE_FORMAT(date_purchase, '%Y-%m') AS month,
      SUM(amount) AS amount_cost
      FROM purchase
      GROUP BY month
      ORDER BY month DESC
      LIMIT 1
  `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(result[0]); // ✅ ส่งแค่เดือนล่าสุด
    });
};

exports.amount_l = (req, res) => {
    const sql = `
    SELECT 
    amount
    FROM purchase
    ORDER BY id_purchase DESC
    LIMIT 1;
  `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(result[0]); // ✅ ส่งแค่เดือนล่าสุด
    });
};



