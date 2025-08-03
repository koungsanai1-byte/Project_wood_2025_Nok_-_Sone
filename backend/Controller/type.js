const db = require('../Config/db');

exports.list = (req, res) => {
    const sql = "SELECT a.*, b.* FROM type as a, name as b WHERE a.id_name = b.id_name";
    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
}

// ➕ เพิ่มข้อมูล type ใหม่
exports.create = (req, res) => {
    const { id_name, type, note } = req.body

    // ตรวจสอบข้อมูลซ้ำ
    const checkSql = 'SELECT * FROM type WHERE id_name = ? AND type = ?'
    db.query(checkSql, [id_name, type], (err, results) => {
        if (err) return res.status(500).json({ error: 'ຂໍອະໄພ, ເກີດຂໍ້ຜິດພາດ' })
        if (results.length > 0) {
            return res.status(400).json({ error: 'ຂໍ້ມູນນີ້ມີແລ້ວ' })
        }

        const insertSql = 'INSERT INTO type (id_name, type, note) VALUES (?, ?, ?)'
        db.query(insertSql, [id_name, type, note], (err2, result) => {
            if (err2) return res.status(500).json({ error: 'ບັນທຶກລົ້ມເຫຼວ' })
            res.json({ insertId: result.insertId })
        })
    })
}


// 🔍 ดึงข้อมูล type รายการเดียว
exports.listById = (req, res) => {
    const sql = "SELECT a.*, b.* FROM type as a JOIN name as b ON a.id_name = b.id_name WHERE a.id_type = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
}

// ✏️ แก้ไขข้อมูล type
exports.update = (req, res) => {
    const id = req.params.id;
    const values = [
        req.body.type,
        req.body.id_name,
        req.body.note,
        id
    ];
    const sql = "UPDATE type SET type = ?, id_name = ?, note = ? WHERE id_type = ?";
    db.query(sql, values, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
}

// ❌ ลบข้อมูล type
exports.deletes = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM type WHERE id_type = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
}
