const bcrypt = require('bcrypt');
const db = require('../Config/db'); 
const saltRounds = 10;

// สร้างผู้ใช้ใหม่
exports.createUser = async (req, res) => {
  try {
    const { username, password, status } = req.body;
    const image_users = req.file ? req.file.filename : null;

    if (!username || !password || !status) {
      return res.status(400).json({ message: 'ກະລຸນາປ້ອນຂໍ້ມູນໄຫ້ຄົບຖ້ວນ' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) return res.status(500).json({ message: 'ເກີດຂໍ້ຜິດພາດ' });
      if (results.length > 0) return res.status(400).json({ message: 'ຊື່ນີ້ມີແລ້ວ' });

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      db.query(
        'INSERT INTO users (username, password, status, image_users) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, status, image_users],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'ຜິດພາດໃນການບັນທຶກ' });
          res.status(201).json({ message: 'ສ້າງຜູ້ໃຊ້ສຳເລັດ', userId: result.insertId });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ดึงรายชื่อผู้ใช้ทั้งหมด
exports.getUsers = (req, res) => {
  db.query('SELECT id_users, username, status, image_users FROM users ORDER BY id_users ASC', (err, results) => {
    if (err) return res.status(500).json({ message: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ' });
    res.json(results);
  });
};



// ลบผู้ใช้ตาม id
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id_users = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    res.json({ message: 'ลบผู้ใช้สำเร็จ' });
  });
};
