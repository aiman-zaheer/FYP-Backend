const express = require("express");
const {
  signUpController,
  logInController,
  refreshTokenController,
} = require("../../controllers/auth.controller.js");

const router = express.Router();

router.post("/signUp", signUpController);
router.post("/login", logInController);
router.get("/refreshToken", refreshTokenController);
module.exports = router;
