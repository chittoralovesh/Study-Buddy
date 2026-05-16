const express = require("express");
const multer = require("multer");
const { processDocument } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 50 * 1024 * 1024 // 50 MB
  }
});

router.post("/process", protect, upload.single("file"), processDocument);

module.exports = router;
