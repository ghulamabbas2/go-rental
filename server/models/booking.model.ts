import {
  BookingPaymentMethods,
  BookingPaymentStatus,
  IBooking,
} from "@go-rental/shared";
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema<IBooking>(
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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phoneNo: {
        type: String,
        required: true,
      },
    },
    amount: {
      tax: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      rent: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    daysOfRent: {
      type: Number,
      required: true,
    },
    rentPerDay: {
      type: Number,
      required: true,
    },
    paymentInfo: {
      id: String,
      status: {
        type: String,
        default: "pending",
        enum: {
          values: BookingPaymentStatus,
          message: "Invalid payment status",
        },
      },
      method: {
        type: String,
        enum: {
          values: BookingPaymentMethods,
          message: "Invalid payment method",
        },
      },
    },
    additionalNotes: String,
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
