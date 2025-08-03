const db = require('../Config/db');

// GET: All sizes
exports.list = (req, res) => {
    const sql = "SELECT a.*, b.name, c.type FROM size as a, name as b, type as c WHERE a.id_name = b.id_name and a.id_type = c.id_type";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
};

// GET: Size by ID with name and type joined
exports.listById = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT a.*, b.name, c.type 
        FROM size AS a 
        JOIN name AS b ON a.id_name = b.id_name 
        JOIN type AS c ON a.id_type = c.id_type 
        WHERE a.id_size = ?
    `;
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: "Size not found" });
        return res.json(result[0]);
    });
};

// POST: Create new size
exports.create = (req, res) => {
    const { size, note, id_name, id_type } = req.body;

    if (!size || !id_name || !id_type) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const sql = "INSERT INTO size (size, note, id_name, id_type) VALUES (?, ?, ?, ?)";
    db.query(sql, [size, note, id_name, id_type], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Size created successfully", id_size: result.insertId });
    });
};

// PUT: Update size
exports.update = (req, res) => {
    const { id } = req.params;
    const { size, note, id_name, id_type } = req.body;

    const sql = `
        UPDATE size 
        SET size = ?, note = ?, id_name = ?, id_type = ?
        WHERE id_size = ?
    `;
    db.query(sql, [size, note, id_name, id_type, id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Size not found" });
        }
        return res.json({ message: "Size updated successfully" });
    });
};

// DELETE: Delete size
exports.deletes = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM size WHERE id_size = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Size not found" });
        }
        return res.json({ message: "Size deleted successfully" });
    });
};
