const UserModel = require("../models/userModel");
const sendResponse = require("../helper/sharedHelper");
const {
  encryptedPassword,
  decryptedPassword,
} = require("../helper/authHelper");
const RatingModel = require("../models/ratingModel");

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
const rateTailor = async (req, res) => {
  console.log("hello");
  try {
    const { customerId, rating, comment } = req.body;
    const tailorId = req.params.tailorId;

    // Ensure that the rating property is provided
    if (rating === undefined || rating === null) {
      sendResponse(res, null, false, 400, "Rating is required.");
      return;
    }

    // Find the rating document for the given tailorId
    let ratingDocument = await RatingModel.findOne({
      "data.tailorId": tailorId,
    });

    if (ratingDocument) {
      // Find the tailor in the array
      const existingTailor = ratingDocument.data.find((item) =>
        item.tailorId.equals(tailorId)
      );

      if (existingTailor) {
        // Check if the reviews property is not present, create it as an array
        if (!existingTailor.reviews) {
          existingTailor.reviews = [];
        }

        // Check if the customer already provided a review
        const existingReviewIndex = existingTailor.reviews.findIndex((review) =>
          review.customerId.equals(customerId)
        );

        if (existingReviewIndex !== -1) {
          // Ensure that existingTailor.reviews[existingReviewIndex].review is an array
          if (
            !Array.isArray(existingTailor.reviews[existingReviewIndex].review)
          ) {
            existingTailor.reviews[existingReviewIndex].review = [];
          }

          // Update existing review
          existingTailor.reviews[existingReviewIndex].review.push({
            rating,
            comment,
          });
        } else {
          // Add a new review to the existing tailor
          existingTailor.reviews.push({
            customerId,
            review: [
              {
                rating,
                comment,
              },
            ],
          });
        }
      } else {
        // Add a new tailor with the customer's review
        ratingDocument.data.push({
          tailorId,
          reviews: [
            {
              customerId,
              review: [
                {
                  rating,
                  comment,
                },
              ],
            },
          ],
        });
      }
    } else {
      // Create a new rating document with the customer's review
      ratingDocument = new RatingModel({
        data: [
          {
            tailorId,
            reviews: [
              {
                customerId,
                review: [
                  {
                    rating,
                    comment,
                  },
                ],
              },
            ],
          },
        ],
      });
    }

    // Save the updated or new rating document
    await ratingDocument.save();

    sendResponse(res, null, true, 200, "ok");
  } catch (error) {
    console.error(error);
    sendResponse(res, null, false, 500, "Internal Server Error");
  }
};
const getTailorRating = async (req, res) => {
  try {
    // Find all rating documents
    const allRatings = await RatingModel.find();

    // Extract reviews from all rating documents
    const allReviews = allRatings.reduce((acc, ratingDocument) => {
      return acc.concat(
        ratingDocument.data.map((item) => ({
          tailorId: item.tailorId,
          reviews: item.reviews,
        }))
      );
    }, []);

    sendResponse(res, allReviews, true, 200, "OK");
  } catch (error) {
    console.error(error);
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
  rateTailor,
  getTailorRating,
};
