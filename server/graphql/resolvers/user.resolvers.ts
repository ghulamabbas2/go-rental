import { Response } from "express";
import { login, registerUser } from "../../controllers/user.controller";
import { UserInput } from "../../types/user.types";

export const userResolvers = {
  Query: {
    me: async (_: any) => {
      return "Current User";
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
