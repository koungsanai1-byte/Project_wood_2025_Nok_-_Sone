const db = require('../Config/db');

exports.list = (req, res) => {
    const sql = `
    SELECT p.id_purchase, n.name, t.type, s.size, v.volume, p.price, p.amount, p.total, p.note,p.user, p.status, date_purchase
    FROM purchase p
    JOIN name n ON p.id_name = n.id_name
    JOIN type t ON p.id_type = t.id_type
    JOIN size s ON p.id_size = s.id_size
    JOIN volume v ON P.id_volume = v.id_volume
    ORDER BY p.id_purchase DESC
  `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
};

exports.list_z = (req, res) => {
    const sql = `
    SELECT p.id_purchase, n.name, t.type, s.size, v.volume, p.price, p.amount, p.total,p.user, p.note, p.status
    FROM purchase p
    JOIN name n ON p.id_name = n.id_name
    JOIN type t ON p.id_type = t.id_type
    JOIN size s ON p.id_size = s.id_size
    JOIN volume v On p.id_volume = v.id_volume
    where status = "ຍັງບໍ່ຈັດເກັບ"
    ORDER BY p.id_purchase DESC
  `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
};



exports.create = (req, res) => {
      console.log(">> Body ที่ส่งมา:", req.body);
    const { volume, price, amount, total, note, id_name, id_type, id_size, u_request } = req.body;
    const sql = "INSERT INTO purchase (status, id_volume, price, amount, total, note, id_name, id_type, id_size, user) VALUES ( 'ຍັງບໍ່ຈັດເກັບ',?, ?, ?, ?, ?, ?, ?, ?, ? ) ";
    db.query(sql, [volume, price, amount, total, note, id_name, id_type, id_size, u_request], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
}


exports.listById = (req, res) => {
    const sql = `
        SELECT p.*
        FROM purchase p
        JOIN name n ON p.id_name = n.id_name
        JOIN type t ON p.id_type = t.id_type
        JOIN size s ON p.id_size = s.id_size
        JOIN volume v ON p.id_volume = v.id_volume
        WHERE p.id_purchase = ?
    `;
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) return res.json(err);
        if (result.length === 0) return res.status(404).json({ message: "Not found" });
        return res.json(result[0]);
    });
}

exports.update = (req, res) => {
    console.log(req.body);
    const id = req.params.id;
    const { id_volume, price, amount, total, note, id_name, id_type, id_size } = req.body;

    const sql = `
        UPDATE purchase 
        SET id_volume = ?, price = ?, amount = ?, total = ?, note = ?, id_name = ?, id_type = ?, id_size = ?
        WHERE id_purchase = ?
    `;

    db.query(sql, [id_volume, price, amount, total, note, id_name, id_type, id_size, id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
}

exports.deletes = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM purchase WHERE id_purchase = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
}

