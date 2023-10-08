const express = require("express");
const authMiddleWare = require("../../middleWare/authMiddleWare.js");
const { editTailor } = require("../../controllers/tailor.controller.js");
const { resetPassword } = require("../../controllers/tailor.controller.js");

const router = express.Router();

router.put("/editTailor/:id", authMiddleWare, editTailor);
router.put("/resetPassword/:id", authMiddleWare, resetPassword);
module.exports = router;
