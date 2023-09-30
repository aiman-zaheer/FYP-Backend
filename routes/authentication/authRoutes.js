const express = require("express");
const authMiddleWare = require("../../middleWare/authMiddleWare.js");
const { signUpController, logInController, refreshTokenController } = require("../../controllers/auth.controller.js");
const aboutController = require("../dummyRoute/dummyRoute.js");

const router = express.Router();

router.post("/signUp", signUpController);
router.post("/login", logInController);
router.get("/about", authMiddleWare, aboutController);
router.get("/refreshToken", refreshTokenController);
module.exports = router;
