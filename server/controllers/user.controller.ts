import { Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import User from "../models/user.model";
import { UserInput } from "../types/user.types";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = catchAsyncErrors(async (userInput: UserInput) => {
  const { name, email, password, phoneNo } = userInput;

  return await User.create({
    name,
    email,
    password,
    phoneNo,
  });
});

export const login = catchAsyncErrors(
  async (email: string, password: string, res: Response) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error("Invalid Email or Password");
    }

    const isPasswordMatched = await bcrypt.compare(password, user?.password);

    if (!isPasswordMatched) {
      throw new Error("Invalid Email or Password");
    }

    const token = jwt.sign({ _id: user?._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: Number(process.env.COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000,
    });

    return user;
  }
);
