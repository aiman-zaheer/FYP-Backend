const {
  decryptedPassword,
  encryptedPassword,
} = require("../helper/authHelper");
const sendResponse = require("../helper/sharedHelper");
const ImageModel = require("../models/imageModel");
const OrderModel = require("../models/orderModel");
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
const uploadImage = async (req, res) => {
  const tailorid = req.params.id;
  const imageBuffer = req.file.buffer;
  const contentType = req.file.mimetype;
  const price = req.body.price;
  const garmentType = req.body.garmentType;

  try {
    const tailor = await UserModel.findOne({ _id: tailorid });
    if (tailor) {
      let userImages = await ImageModel.findOne({ tailorid });

      if (!userImages) {
        userImages = await ImageModel.create({ tailorid, images: [] });
      }

      userImages.images.push({
        data: imageBuffer,
        contentType,
        price,
        garmentType,
      });
      await userImages.save();
      sendResponse(res, null, true, 200, "Image uploaded successfully");
    } else {
      sendResponse(res, null, false, 404, "tailor not found");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    sendResponse(res, null, false, 400, "Error uploading image");
  }
};
const getImage = async (req, res) => {
  const tailorid = req.params.id;
  try {
    const tailor = await UserModel.findOne({ _id: tailorid });
    if (tailor) {
      const userImages = await ImageModel.findOne({ tailorid });
      if (!userImages) {
        return sendResponse(res, null, false, 404, "user not found");
      }
      sendResponse(res, userImages.images, true, 200, "ok");
    } else {
      sendResponse(res, null, false, 404, "tailor not found");
    }
  } catch (error) {
    console.error("Error getting images:", error);
    sendResponse(res, null, false, 500, "Error getting images");
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const newStatus = req.body.status;
    const tailorId = req.body.tailorId; // Assuming you include the tailor ID in the request body

    // Check if the order exists
    const order = await OrderModel.findById(orderId);
    if (!order) {
      sendResponse(res, null, false, 404, "Order not found");
      return;
    }

    // Verify that the provided tailor ID matches the order's tailorId
    if (order.tailorId.toString() !== tailorId) {
      sendResponse(res, null, false, 404, "tailor not found");
      return;
    }

    // Update the order status
    order.status = newStatus;
    await order.save();

    // Send a success response
    sendResponse(res, null, true, 200, "Order status updated successfully");
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error(error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
};
const orderDetails = async (req, res) => {
  try {
    const tailorId = req.params.tailorId;
    const tailor = await UserModel.findOne({ _id: tailorId });
    if (tailor) {
      // Fetch orders associated with the specified tailor
      const orders = await OrderModel.find({ tailorId });

      if (orders && orders.length > 0) {
        // Send the list of orders in the response
        sendResponse(res, orders, true, 200, "Orders fetched successfully");
      } else {
        sendResponse(res, null, false, 404, "Orders not found");
      }
    } else {
      sendResponse(res, null, false, 404, "tailor not found");
    }
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error(error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
};
module.exports = {
  editTailor,
  resetPassword,
  deleteTailor,
  uploadImage,
  getImage,
  updateOrderStatus,
  orderDetails,
};
