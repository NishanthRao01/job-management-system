const multer = require("multer");
const AppError = require("../utils/AppError");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword" // .doc just in case, though docx/pdf are primary
  ];
  
  const ext = file.originalname.split(".").pop().toLowerCase();
  const allowedExtensions = ["pdf", "docx", "doc"];

  if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
    return cb(new AppError("Invalid file type. Only PDF and DOCX files are allowed.", 400), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single("resume");

exports.uploadResumeMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(new AppError("File is too large. Maximum size is 5MB.", 400));
        }
        return next(new AppError(`File upload error: ${err.message}`, 400));
      }
      return next(err);
    }
    if (!req.file) {
      return next(new AppError("No file uploaded", 400));
    }
    next();
  });
};
