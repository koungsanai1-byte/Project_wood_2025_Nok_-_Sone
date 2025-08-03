const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ສ້າງໂຟນເດີ້ຖ້າຍັງບໍ່ມີ
const uploadDir = 'public/uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('ສາມາດອັບໂຫຼດໄດ້ສະເພາະຮູບພາບ (JPEG, JPG, PNG, GIF, WebP)'));
  }
};

module.exports = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // ຈຳກັດ 5MB
  }
});