const UserModel = require("../models/userModel");
const {
  encryptedPassword,
  getAccessToken,
  getRefreshToken,
  decryptedPassword,
} = require("../helper/authHelper");
const jwt = require("jsonwebtoken");
const sendResponse = require("../helper/sharedHelper");
const fs = require('fs');
// const path = require('path');
// const logStream = fs.createWriteStream(path.join(__dirname, 'console.log'), { flags: 'a' });

const signUpController = async (req, res) => {
  try {
    const { email } = req.body;
    const ss = await UserModel.findOne({ email });
    if (ss) {
      sendResponse(res, null, false, 403, "already exist");
    } else {
      const { password, ...restbody } = req.body;
      const encryptPassword = await encryptedPassword(password);
      const data = { ...restbody, password: encryptPassword };
      const user = await UserModel.create(data);
      const dataObject = user.toObject();
      const { email, password: pass, ...restData } = dataObject;

      
      sendResponse(res, restData, true, 200, "ok");
    }
  } catch (error) {
    // logStream.write(`${new Date().toISOString()} - ${error}\n`);

    sendResponse(res, null, false, 500, error);
    console.log(`${error}`);
  }
};
const logInController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const ss = await UserModel.findOne({ email, role });
    if (ss) {
      const isPasswordCorrect = await decryptedPassword(password, ss);
      if (isPasswordCorrect) {
        const accessToken = getAccessToken(ss);
        const refreshToken = getRefreshToken(ss);
        res.setHeader("Authorization", `Bearer ${accessToken}`);
        res.setHeader("Refresh_Token", `Bearer ${refreshToken}`);
        const dataObject = ss.toObject();
        const { email, password, ...restData } = dataObject;
        sendResponse(res, restData, true, 200, "ok");
      } else {
        sendResponse(res, null, false, 404, "Invalid email or password");
      }
    } else {
      sendResponse(res, null, false, 404, "Invalid email or password");
    }
  } catch (error) {
    sendResponse(res, null, false, 500, "Internal Error!");
    console.log(`${error}`);
  }
};
const refreshTokenController = (req, res) => {
  const Refresh_Token = req.headers["refresh_token"].split(" ")[1];
  try {
    jwt.verify(
      Refresh_Token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          sendResponse(res, null, false, 401, "Unauthorized");
        } else {
          const accessToken = getAccessToken(decoded);
          res.setHeader("Authorization", `Bearer ${accessToken}`);
          sendResponse(res, null, true, 200, "refresh token generated");
        }
      }
    );
  } catch (error) {
    sendResponse(res, null, false, 500, "Internal Error!");
    console.log(error);
  }
};
module.exports = {
  signUpController,
  logInController,
  refreshTokenController,
};
