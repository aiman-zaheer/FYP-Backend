const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  tailorid: String,
  images: [
    {
      data: Buffer,
      contentType: String,
      price: Number,
      garmentType: String,
    },
  ],
});
const ImageModel = mongoose.model("ImageModel", ImageSchema);
module.exports = ImageModel;
