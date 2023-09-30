const sendResponse = require("../../helper/sharedHelper");

const aboutController = (req, res) => {
  sendResponse(res, null, true, 200, "correct");
};
module.exports = aboutController;
