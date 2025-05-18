const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express(); // ✅ Must be declared before use
app.use(cors());

// ✅ Serve images statically from C:/flutter_uploads
const imagePath = path.join('C:/flutter_uploads');
app.use('/images', express.static(imagePath));

// ✅ Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const folder = req.body.folder || 'other';
      const dir = path.join('C:/flutter_uploads', folder);

      // Create folder if not exists
      fs.mkdirSync(dir, { recursive: true });

      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uid = req.body.uid || 'unknown_user';
      const ext = path.extname(file.originalname);
      cb(null, `${uid}${ext}`);
    },
  }),
});

// ✅ Handle file upload via POST
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('✅ File uploaded to FTP server successfully!');
});

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
