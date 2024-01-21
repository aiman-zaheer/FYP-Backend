const mongoose = require("mongoose");

const MeasurementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const DescriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  descriptions: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  tailorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  orderSummary: {
    styles: [{ type: String, required: true }], // Array of style names
    description: [DescriptionSchema],
    measurements: [MeasurementSchema],
  },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: "pending" },
  deliveryDate: { type: Date },
  contact: {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  total: { type: Number },
  deliveryAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model("OrderModel", OrderSchema);

module.exports = OrderModel;
