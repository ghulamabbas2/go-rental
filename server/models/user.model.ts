import { IUser, UserRoles } from "@go-rental/shared";
import mongoose from "mongoose";
import * as bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [6, "Your password must be longer than 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    phoneNo: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    role: {
      type: [String],
      default: "user",
      enum: {
        values: UserRoles,
        message: "Please select correct role for user",
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // only hash the password it it has been modified
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
