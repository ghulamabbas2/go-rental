import { IReview } from "@go-rental/shared";
import mongoose, { Schema } from "mongoose";
import Car from "./car.model";

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Car.findByIdAndUpdate(doc.car, { $pull: { reviews: doc.id } });
  }
});

const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
