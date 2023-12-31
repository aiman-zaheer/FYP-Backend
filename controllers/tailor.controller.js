const {
  decryptedPassword,
  encryptedPassword,
} = require("../helper/authHelper");
const sendResponse = require("../helper/sharedHelper");
const UserModel = require("../models/userModel");

const editTailor = async (req, res) => {
  try {
    const { id } = req.params;
    const tailor = await UserModel.findOne({
      $and: [{ role: "tailor" }, { _id: id }],
    }).select("-password");
    if (tailor) {
      let updatedTailor = await UserModel.updateOne(
        { _id: id },
        { $set: req.body }
      );
      if (updatedTailor.modifiedCount > 0) {
        updatedTailor = await UserModel.findOne({
          $and: [{ role: "tailor" }, { _id: id }],
        }).select("-password");
        sendResponse(res, updatedTailor, true, 200, "ok");
      } else {
        sendResponse(res, tailor, true, 200, "ok");
      }
    } else {
      sendResponse(res, null, false, 404, "Not found");
    }
  } catch (error) {
    console.log("error", error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
};
const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const tailor = await UserModel.findOne({
      $and: [{ role: "tailor" }, { _id: id }],
    });
    if (tailor) {
      const decryptPassword = await decryptedPassword(currentPassword, tailor);
      if (decryptPassword) {
        const encryptPassword = await encryptedPassword(newPassword, tailor);
        await UserModel.updateOne(
          { _id: id },
          { $set: { password: encryptPassword } }
        );
        const resetPassword = await UserModel.findOne({
          $and: [{ role: "tailor" }, { _id: id }],
        }).select("-password");
        console.log(resetPassword);
        sendResponse(res, resetPassword, true, 200, "ok");
      } else {
        sendResponse(res, null, false, 401, "Wrong Password");
      }
    } else {
      sendResponse(res, null, false, 404, "Not found");
    }
  } catch (error) {
    console.log("error", error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
};
const deleteTailor = async (req, res) => {
  try {
    const { id } = req.params;
    const tailor = await UserModel.deleteOne({
      $and: [{ role: "tailor" }, { _id: id }],
    });
    if (tailor.deletedCount !== 0) {
      sendResponse(res, null, true, 200, "ok");
    } else {
      sendResponse(res, null, false, 404, "Tailor not Found");
    }
  } catch (error) {
    console.log("error", error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
};
module.exports = {
  editTailor,
  resetPassword,
  deleteTailor,
};
