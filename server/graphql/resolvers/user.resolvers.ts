import { Response } from "express";
import { login, registerUser } from "../../controllers/user.controller";
import { UserInput } from "../../types/user.types";
import { IUser } from "@go-rental/shared";

export const userResolvers = {
  Query: {
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
  },
};
