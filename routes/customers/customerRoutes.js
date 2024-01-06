const express = require("express");
const authMiddleWare = require("../../middleWare/authMiddleWare.js");
const {
  getAllTailors,
  editCustomer,
  resetPassword,
  deleteCustomer,
  addToFavTailor,
  allFavTailor
} = require("../../controllers/customer.controller.js");

const router = express.Router();

router.get("/getAllTailors", authMiddleWare, getAllTailors);
router.put("/editCustomer/:id", authMiddleWare, editCustomer);
router.put("/resetPassword/:id", authMiddleWare, resetPassword);
router.delete("/deleteCustomer/:id", authMiddleWare, deleteCustomer);
router.post("/addFavourite", authMiddleWare, addToFavTailor);
router.get("/getFavourite", authMiddleWare, allFavTailor)
module.exports = router;
