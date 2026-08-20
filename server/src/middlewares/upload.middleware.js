import fs from 'fs';
import multer from 'multer';
import path from 'path';

// uploads folders Absolute path
const uploadDir = path.join(process.cwd(), 'uploads');

// uploads folder create
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // absolute path
  },
  filename: (req, file, cb) => {
    const cleanFileName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${cleanFileName}`);
  },
});

// file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Only .jpeg, .jpg, .png and .webp formats are allowed!'),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
