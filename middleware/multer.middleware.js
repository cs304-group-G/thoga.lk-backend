import multer, { memoryStorage } from "multer";

const fileHandler = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // keep file size < 10 MB
  },
});

export default fileHandler;
