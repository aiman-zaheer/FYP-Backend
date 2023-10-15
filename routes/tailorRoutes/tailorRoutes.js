const express = require("express");
const authMiddleWare = require("../../middleWare/authMiddleWare.js");
const {
  editTailor,
  deleteTailor,
  resetPassword,
} = require("../../controllers/tailor.controller.js");

const router = express.Router();

router.put("/editTailor/:id", authMiddleWare, editTailor);
router.put("/resetPassword/:id", authMiddleWare, resetPassword);
router.delete("/deleteTailor/:id", authMiddleWare, deleteTailor);
module.exports = router;
