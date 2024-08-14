import mongoose from "mongoose";
import Car from "../models/car.model";
import { cars } from "./data";

const seedCars = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/go-rental");

    await Car.deleteMany();
    console.log("Cars deleted");

    await Car.insertMany(cars);
    console.log("Cars added");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedCars();
