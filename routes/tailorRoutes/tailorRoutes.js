const express = require("express");
const authMiddleWare = require("../../middleWare/authMiddleWare.js");
const {
  editTailor,
  deleteTailor,
  resetPassword,
  uploadImage,
  getImage,
} = require("../../controllers/tailor.controller.js");

const multer = require("multer");

const router = express.Router();

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.put("/editTailor/:id", authMiddleWare, editTailor);
router.put("/resetPassword/:id", authMiddleWare, resetPassword);
router.delete("/deleteTailor/:id", authMiddleWare, deleteTailor);
router.post("/upload/:id", authMiddleWare, upload.single("image"), uploadImage);
router.get("/getImages/:id", authMiddleWare, getImage);

module.exports = router;
