const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    collation: { locale: "en", strength: 2 },
  },
  lastname: {
    type: String,
    required: true,
    collation: { locale: "en", strength: 2 },
  },
  email: {
    type: String,
    required: true,
    collation: { locale: "en", strength: 2 },
  },
  gender: {
    type: String,
    required: true,
    collation: { locale: "en", strength: 2 },
  },
  contactno: {
    type: String,
    required: true,
    collation: { locale: "en", strength: 2 },
  },
  address: {
    type: String,
    required: false,
    collation: { locale: "en", strength: 2 },
  },
  businessdescription: {
    type: String,
    required: false,
    collation: { locale: "en", strength: 2 },
  },
  garmenttype: {
    type: String,
    required: false,
    collation: { locale: "en", strength: 2 },
  },
  garmentstyle: {
    type: String,
    required: false,
    collation: { locale: "en", strength: 2 },
  },
  password: {
    type: String,
    required: true,
    collation: { locale: "en", strength: 2 },
  },
  role: {
    type: String,
    required: true,
  },
  favourites: [],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
