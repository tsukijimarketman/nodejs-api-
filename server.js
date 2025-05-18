const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

// Use relative path for uploads
const imagePath = path.join(__dirname, 'uploads');
app.use('/images', express.static(imagePath));

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const folder = req.body.folder || 'other';
      const dir = path.join(imagePath, folder);

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

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('✅ File uploaded successfully!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
