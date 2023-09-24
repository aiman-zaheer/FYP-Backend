const express = require("express");
// const {
//   logInController,
//   signUpController,
// } = require("../../controllers/auth.controller.js");
const UserModel = require("../../models/userModel.js");

const router = express.Router();

router.post("/signUp", async (req, res) => {
  try {
    const ss = await UserModel.create(req.body);
    res.status(200).json({ data: ss, success: "true", status: 200 });
  } catch (error) {
    res.status(500).json({ data: null, success: "false", status: 500 });
    console.log(`${error}`);
  }
});
router.post("/login", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const ss = await UserModel.findOne({ email });
    if (ss) {
      res.status(200).json({ data: ss, success: "true", status: 200 });
    } else {
      res.status(500).json({ data: null, success: "false", status: 404 });
    }
  } catch (error) {
    res.status(500).json({ data: null, success: "false", status: 500 });
    console.log(`${error}`);
  }
});
module.exports = router;
