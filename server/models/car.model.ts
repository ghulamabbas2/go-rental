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
import geocoder from "../utils/geoCoder";

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
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      streetName: String,
      city: String,
      state: String,
      stateCode: String,
      zipcode: String,
      country: String,
      countryCode: String,
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
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
  }
);

carSchema.virtual("ratings").get(function () {
  let numOfReviews = this.reviews.length;

  if (numOfReviews === 0) {
    return {
      value: 5,
      count: 1,
    };
  }

  const ratingsSum = this.reviews.reduce(
    (sum: number, review: any) => sum + review.rating,
    0
  );

  const value = numOfReviews > 0 ? ratingsSum / numOfReviews : 0;
  return { value, count: numOfReviews };
});

carSchema.pre("save", async function (next) {
  if (!this.isModified("address")) return next();

  const loc = await geocoder.geocode(this.address);

  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    streetName: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].administrativeLevels.level1long,
    stateCode: loc[0].administrativeLevels.level1short,
    zipcode: loc[0].zipcode,
    country: loc[0].country,
    countryCode: loc[0].countryCode,
  };

  next();
});

const Car = mongoose.model<ICar>("Car", carSchema);
export default Car;
