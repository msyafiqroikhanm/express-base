const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (fs.existsSync('public')) {
      cb(null, 'public');
    } else {
      fs.mkdirSync('public');
      cb(null, 'public');
    }
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

module.exports = storage;
