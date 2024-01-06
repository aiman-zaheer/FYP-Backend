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
        }).select("-password");
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
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await UserModel.deleteOne({
      $and: [{ role: "customer" }, { _id: id }],
    });
    if (customer.deletedCount !== 0) {
      sendResponse(res, null, true, 200, "ok");
    } else {
      sendResponse(res, null, false, 404, "Customer not Found");
    }
  } catch (error) {
    console.log("error", error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
};
const addToFavTailor = async (req, res) => {
  try {
    const { customerid, tailorid } = req.body;
    const customer = await UserModel.findOne({ _id: customerid });
    if (customer) {
      if (customer.favourites.includes(tailorid)) {
        await UserModel.findByIdAndUpdate(customerid, {
          $pull: { favourites: tailorid },
        });
        sendResponse(res, null, true, 200, "ok");
      } else {
        await UserModel.findByIdAndUpdate(customerid, {
          $addToSet: { favourites: tailorid },
        });
        sendResponse(res, null, true, 200, "ok");
      }
    } else {
      sendResponse(res, null, false, 404, "Customer not Found");
    }
  } catch (error) {
    console.log("error", error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
};

const allFavTailor = async (req, res) => {
  try {
    const { customerid } = req.body;
    const customer = await UserModel.findOne({ _id: customerid });
    if (customer) {
      sendResponse(res, customer.favourites, true, 200, "ok");
    } else {
      sendResponse(res, null, false, 404, "Customer not Found");
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
  deleteCustomer,
  addToFavTailor,
  allFavTailor,
};
