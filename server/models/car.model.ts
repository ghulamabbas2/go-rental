import mongoose from "mongoose";
import {
  CarStatus,
  CarBrand,
  CarTransmissions,
  CarSeats,
  CarDoors,
  CarFuelTypes,
  CarCategories,
  ICar,
} from "@go-rental/shared";

const carSchema = new mongoose.Schema<ICar>(
  {
    name: {
      type: String,
      required: [true, "Please enter car name"],
    },
    description: {
      type: String,
      required: [true, "Please enter car description"],
    },
    status: {
      type: String,
      default: "Draft",
      enum: {
        values: CarStatus,
        message: "Please select correct status for car",
      },
    },
    rentPerDay: {
      type: Number,
      required: [true, "Please enter rent per day"],
    },
    address: {
      type: String,
      required: [true, "Please enter address"],
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    brand: {
      type: String,
      required: [true, "Please enter car brand"],
      enum: {
        values: CarBrand,
        message: "Please select correct brand for car",
      },
    },
    year: {
      type: Number,
      required: [true, "Please enter car year"],
    },
    transmission: {
      type: String,
      required: [true, "Please enter car transmission"],
      enum: {
        values: CarTransmissions,
        message: "Please select correct transmission for car",
      },
    },
    milleage: {
      type: Number,
      required: [true, "Please enter car milleage"],
    },
    power: {
      type: Number,
      required: [true, "Please enter car power"],
    },
    seats: {
      type: Number,
      required: [true, "Please enter car seats"],
      enum: {
        values: CarSeats,
        message: "Please select correct seats for car",
      },
    },
    doors: {
      type: Number,
      required: [true, "Please enter car doors"],
      enum: {
        values: CarDoors,
        message: "Please select correct doors for car",
      },
    },
    fuelType: {
      type: String,
      required: [true, "Please enter car fuel type"],
      enum: {
        values: CarFuelTypes,
        message: "Please select correct fuel type for car",
      },
    },
    category: {
      type: String,
      required: [true, "Please enter car category"],
      enum: {
        values: CarCategories,
        message: "Please select correct category for car",
      },
    },
    reviews: [String],
  },
  {
    timestamps: true,
  }
);

carSchema.virtual("ratings").get(function () {
  return {
    value: 5,
    count: 10,
  };
});

const Car = mongoose.model<ICar>("Car", carSchema);
export default Car;
