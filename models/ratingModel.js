const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  data: [
    {
      tailorId: { type: mongoose.Schema.Types.ObjectId, required: true },
      reviews: [
        {
          customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
          review: [
            {
              rating: { type: Number, required: true },
              comment: { type: String },
              createdAt: { type: Date, default: Date.now },
            },
          ],
        },
      ],
    },
  ],
});

const RatingModel = mongoose.model("RatingModel", RatingSchema);

module.exports = RatingModel;
