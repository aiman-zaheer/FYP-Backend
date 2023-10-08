const UserModel = require("../models/userModel");
const sendResponse = require("../helper/sharedHelper");
const {
  encryptedPassword,
  decryptedPassword,
} = require("../helper/authHelper");

const getAllTailors = async (req, res) => {
  try {
    const tailors = await UserModel.find({ role: "tailor" }).select(
      "-password -email"
    );
    sendResponse(res, tailors, true, 200, "ok");
  } catch (error) {
    console.log("error", error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
};

const editCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await UserModel.findOne({
      $and: [{ role: "customer" }, { _id: id }],
    }).select("-password");
    if (customer) {
      let updatedCustomer = await UserModel.updateOne(
        { _id: id },
        { $set: req.body }
      );
      if (updatedCustomer.modifiedCount > 0) {
        updatedCustomer = await UserModel.findOne({
          $and: [{ role: "customer" }, { _id: id }],
        }).select("-password");
        sendResponse(res, updatedCustomer, true, 200, "ok");
      } else {
        sendResponse(res, customer, true, 200, "ok");
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
    const customer = await UserModel.findOne({
      $and: [{ role: "customer" }, { _id: id }],
    });
    if (customer) {
      const decryptPassword = await decryptedPassword(
        currentPassword,
        customer
      );
      if (decryptPassword) {
        const encryptPassword = await encryptedPassword(newPassword, customer);
        await UserModel.updateOne(
          { _id: id },
          { $set: { password: encryptPassword } }
        );
        const resetPassword = await UserModel.findOne({
          $and: [{ role: "customer" }, { _id: id }],
        }).select('-password');
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
module.exports = {
  getAllTailors,
  editCustomer,
  resetPassword,
};
