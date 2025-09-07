import multer from 'multer';

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage }); // ✅ Correct — use { storage }
export default upload;
