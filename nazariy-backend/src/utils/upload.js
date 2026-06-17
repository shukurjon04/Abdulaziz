const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

// Faqat rasm va PDF (chek uchun) fayllariga ruxsat — boshqa turlar (.exe, .php, .html va h.k.) rad etiladi
const ALLOWED_MIME = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf",
]);
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"]);

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
    return cb(new Error("Ruxsat etilmagan fayl turi. Faqat JPG, PNG, WEBP, GIF yoki PDF yuklash mumkin."));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Saqlangan faylga ochiq URL yo'lini qaytaradi (statik serve /uploads orqali)
function fileUrl(filename) {
  return `/uploads/${filename}`;
}

module.exports = { upload, fileUrl, UPLOAD_DIR };
