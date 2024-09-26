import { Response } from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  login,
  registerUser,
  resetPassword,
  updatePassword,
  updateUserProfile,
  uploadUserAvatar,
} from "../../controllers/user.controller";
import { UserInput } from "../../types/user.types";
import { IUser } from "@go-rental/shared";

export const userResolvers = {
  Query: {
    getAllUsers: async (
      _: any,
      { page, query }: { page: number; query: string }
    ) => getAllUsers(page, query),
    me: async (_: any, __: any, { user }: { user: IUser }) => {
      return user;
    },
    logout: async (_: any, __: any, { res }: { res: Response }) => {
      res.cookie("token", null, { maxAge: 0 });
      return true;
    },
  },
  Mutation: {
    registerUser: async (_: any, { userInput }: { userInput: UserInput }) => {
      return registerUser(userInput);
    },

    login: async (
      _: any,
      { email, password }: { email: string; password: string },
      { res }: { res: Response }
    ) => {
      return login(email, password, res);
    },
    updateUserProfile: async (
      _: any,
      { userInput }: { userInput: Partial<UserInput> },
      { user }: { user: IUser }
    ) => updateUserProfile(userInput, user.id),
    updatePassword: async (
      _: any,
      {
        oldPassword,
        newPassword,
      }: { oldPassword: string; newPassword: string },
      { user }: { user: IUser }
    ) => updatePassword(oldPassword, newPassword, user.id),
    uploadUserAvatar: async (
      _: any,
      { avatar }: { avatar: string },
      { user }: { user: IUser }
    ) => uploadUserAvatar(avatar, user.id),
    forgotPassword: async (_: any, { email }: { email: string }) =>
      forgotPassword(email),
    resetPassword: async (
      _: any,
      {
        token,
        password,
        confirmPassword,
      }: { token: string; password: string; confirmPassword: string }
    ) => resetPassword(token, password, confirmPassword),

    updateUser: async (
      _: any,
      { userId, userInput }: { userId: string; userInput: Partial<UserInput> }
    ) => updateUserProfile(userInput, userId),
    deleteUser: async (_: any, { userId }: { userId: string }) =>
      deleteUser(userId),
  },
};
