import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const uploadSinglePDF = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 3 MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb, 'pdf');
  }
}).array("files"); // Upload 8 files

// Check file Type
function checkFileType(file, cb, fileType) {
  // Allowed ext
  const allowedFileTypes = fileType || ['pdf']; // Default: PDF
  // Check ext
  const extName = path.extname(file.originalname).toLowerCase().substring(1);
  if (allowedFileTypes.includes(extName)) {
    return cb(null, true);
  } else {
    cb(`Error: Allowed file types are ${allowedFileTypes.join(', ')}`);
  }
}

export { uploadSinglePDF };