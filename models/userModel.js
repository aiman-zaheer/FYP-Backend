const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    collation: { locale: "en", strength: 2 },
  },
  name: {
    type: String,
    required: true,
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
});

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
