const db = require('../Config/db');

exports.list = (req, res) => {
    const sql = "SELECT * FROM name";
    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
};

exports.create = (req, res) => {
    const { name, note } = req.body;

    // ตรวจสอบว่ามีชื่อซ้ำในฐานข้อมูลหรือไม่
    const checkSql = "SELECT * FROM name WHERE name = ?";
    db.query(checkSql, [name], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) {
            return res.status(400).json({ message: "ຊື່ນີ້ມີແລ້ວ" });
        }

        // ถ้าไม่มีข้อมูลซ้ำ ให้ทำการ insert
        const insertSql = "INSERT INTO name (name, note) VALUES (?, ?)";
        db.query(insertSql, [name, note], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            return res.status(200).json({ message: "inserted", data: result });
        });
    });
};


exports.listById = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM name WHERE id_name = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
};

exports.update = (req, res) => {
    const id = req.params.id;
    const values = [
        req.body.name,
        req.body.note,
        id
    ];
    const sql = "UPDATE name SET name = ?, note = ? WHERE id_name = ?";
    db.query(sql, values, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
};

exports.deletes = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM name WHERE id_name = ? ";
    db.query(sql, [id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);   
    })
}


