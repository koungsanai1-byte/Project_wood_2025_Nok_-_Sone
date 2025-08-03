const db = require('../Config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'ປ້ອນຊື້ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານກ່ອນ' });

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'ເກີດຂໍ້ຜິດພາດ' });
    if (results.length === 0) return res.status(401).json({ message: 'ບໍ່ພົບຜູ້ໃຊ້ງານ' });

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'ລະຫັດບໍ່ຖືກ' });

    const token = jwt.sign(
      { id: user.id_users, status: user.status },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'ເຂົ້າລະບົບສຳເລັດ', token, user: { username: user.username, status: user.status, image_users: user.image_users } });
  });
};

// ตรวจสอบ token
exports.verifyToken = (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // ถ้า token ใช้ได้ ให้ส่งข้อมูลผู้ใช้กลับไป
    res.json({ valid: true, user: decoded });
  });
};


