import { ICoupon } from "@go-rental/shared";
import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema<ICoupon>(
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
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    discountPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    expiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);
export default Coupon;
