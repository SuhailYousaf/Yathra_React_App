const multer = require('multer');
const path = require('path');

// Your `multer` configuration
const max = 50 * 1024 * 1024; // 50MB as the maximum file size, adjust as needed
const multerMiddleware = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: max,
  },
});

module.exports = multerMiddleware;
