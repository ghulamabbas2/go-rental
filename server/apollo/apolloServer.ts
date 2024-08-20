import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Application, json, Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import { carTypeDefs } from "../graphql/typeDefs/car.typeDefs";
import { carResolvers } from "../graphql/resolvers/car.resolvers";
import User from "../models/user.model";
import { permissions } from "../middlewares/permissions";
import { applyMiddleware } from "graphql-middleware";
import { userResolvers } from "../graphql/resolvers/user.resolvers";
import { userTypeDefs } from "../graphql/typeDefs/user.typeDefs";

interface CustomJwtPayload {
  _id: string;
}

export async function startApolloServer(app: Application) {
  const typeDefs = [carTypeDefs, userTypeDefs];
  const resolvers = [carResolvers, userResolvers];

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const schemaWithMiddleware = applyMiddleware(schema, permissions);

  const apolloServer = new ApolloServer({
    schema: schemaWithMiddleware,
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors({
      credentials: true,
      origin: ["http://localhost:3000"],
    }),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }: { req: Request; res: Response }) => {
        const token = req.cookies?.token;
        let user = null;

        if (token) {
          try {
            const decoded = jwt.verify(
              token,
              process.env.JWT_SECRET!
            ) as CustomJwtPayload;
            user = await User.findById(decoded._id);

            if (!user) throw new Error("User not found");
          } catch (error) {
            throw new Error("Invalid or expired token");
          }
        }

        return { req, res, user };
      },
    })
  );
}
