import { Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import User from "../models/user.model";
import { UserInput } from "../types/user.types";
import * as bcrypt from "bcryptjs";
import crypto from "crypto";

import jwt from "jsonwebtoken";
import {
  deleteImageToCloudinary,
  uploadImageToCloudinary,
} from "../utils/cloudinary";
import { resetPasswordHTMLTemplate } from "../utils/emailTemplate";
import sendEmail from "../utils/sendEmail";

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

export const updateUserProfile = catchAsyncErrors(
  async (userData: Partial<UserInput>, userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user?.set(userData).save();

    return true;
  }
);

export const updatePassword = catchAsyncErrors(
  async (oldPassword: string, newPassword: string, userId: string) => {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordMatched = await bcrypt.compare(oldPassword, user?.password);

    if (!isPasswordMatched) {
      throw new Error("Old password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return true;
  }
);

export const uploadUserAvatar = catchAsyncErrors(
  async (avatar: string, userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const avatarResponse = await uploadImageToCloudinary(
      avatar,
      "gorental/avatars"
    );

    // Remove old avatar from cloudinary
    if (user?.avatar?.public_id) {
      await deleteImageToCloudinary(user?.avatar?.public_id);
    }

    await User.findByIdAndUpdate(userId, {
      avatar: avatarResponse,
    });

    return true;
  }
);

export const forgotPassword = catchAsyncErrors(async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = user.getResetPasswordToken();

  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = resetPasswordHTMLTemplate(user?.name, resetUrl);

  try {
    await sendEmail({
      email: user?.email,
      subject: "GoRental Password Recovery",
      message,
    });

    return true;
  } catch (error: any) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    throw new Error(error?.message);
  }
});

export const resetPassword = catchAsyncErrors(
  async (token: string, password: string, confirmPassword: string) => {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Password reset token is invalid or has expired");
    }

    if (password !== confirmPassword) {
      throw new Error("Password does not match");
    }

    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return true;
  }
);
