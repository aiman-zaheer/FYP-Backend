const express = require("express");
const authMiddleWare = require("../../middleWare/authMiddleWare.js");
const {
  getAllTailors,
  editCustomer,
  resetPassword,
  deleteCustomer,
  addToFavTailor,
  allFavTailor,
  rateTailor,
  getTailorRating,
} = require("../../controllers/customer.controller.js");
const { getImage } = require("../../controllers/tailor.controller.js");

const router = express.Router();

router.get("/getAllTailors", authMiddleWare, getAllTailors);
router.put("/editCustomer/:id", authMiddleWare, editCustomer);
router.put("/resetPassword/:id", authMiddleWare, resetPassword);
router.delete("/deleteCustomer/:id", authMiddleWare, deleteCustomer);
router.post("/addFavourite", authMiddleWare, addToFavTailor);
router.get("/getFavourite", authMiddleWare, allFavTailor);
router.get("/getImages/:id", authMiddleWare, getImage);
router.post("/rateTailor/:tailorId", authMiddleWare, rateTailor);
router.get("/getAllRating/", authMiddleWare, getTailorRating);

module.exports = router;
