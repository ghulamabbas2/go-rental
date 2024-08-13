import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    let connectionString = "";

    if (process.env.NODE_ENV === "development")
      connectionString = process.env.MONGO_URI_LOCAL!;
    if (process.env.NODE_ENV === "production")
      connectionString = process.env.MONGO_URI!;

    mongoose.connect(connectionString).then(() => {
      console.log("Connected to Database.");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
