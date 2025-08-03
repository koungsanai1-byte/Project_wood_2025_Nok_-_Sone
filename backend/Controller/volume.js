const db = require('../Config/db');

// Get all volume
exports.getAllVolume = (req, res) => {
  db.query('SELECT * FROM volume', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

// Get volume by id
exports.getVolumeById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM volume WHERE id_volume = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(results[0]);
  });
};

// Create volume
exports.createVolume = (req, res) => {
  const { volume } = req.body;
  if (!volume || volume.trim() === '') {
    return res.status(400).json({ error: 'volume is required' });
  }

  db.query('INSERT INTO volume (volume) VALUES (?)', [volume], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Duplicate volume' });
      return res.status(500).json({ error: 'Insert failed' });
    }
    res.json({ id: result.insertId });
  });
};

// Update volume
exports.updateVolume = (req, res) => {
  const { id } = req.params;
  const { volume } = req.body;

  db.query('UPDATE volume SET volume = ? WHERE id_volume = ?', [volume, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    res.json({ message: 'Updated successfully' });
  });
};

// Delete volume
exports.deleteVolume = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM volume WHERE id_volume = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'Deleted successfully' });
  });
};
