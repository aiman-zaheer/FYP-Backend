const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendResponse = require("../helper/sharedHelper");
dotenv.config();
const authMiddleWare = (req, res, next) => {
  const authorizationToken = req.headers["authorization"].split(" ")[1];
  if (authorizationToken) {
    jwt.verify(
      authorizationToken,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decode) => {
        if (error) {
          sendResponse(res, null, false, 401, "Unauthorized");
        } else {
          console.log("decode: ", decode);
          next();
        }
      }
    );
  } else {
    sendResponse(res, null, false, 401, "token not exist");
  }
};
module.exports = authMiddleWare;
