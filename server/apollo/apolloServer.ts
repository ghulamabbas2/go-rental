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
import { bookingTypeDefs } from "../graphql/typeDefs/booking.typeDefs";
import { bookingResolvers } from "../graphql/resolvers/booking.resolvers";
import { paymentTypeDefs } from "../graphql/typeDefs/payment.typeDefs";
import { paymentResolvers } from "../graphql/resolvers/payment.resolvers";
import { webhookHandler } from "../controllers/payment.controller";
import { reviewTypeDefs } from "../graphql/typeDefs/review.typeDefs";
import { reviewResolvers } from "../graphql/resolvers/review.resolvers";

interface CustomJwtPayload {
  _id: string;
}

export async function startApolloServer(app: Application) {
  const typeDefs = [
    carTypeDefs,
    userTypeDefs,
    bookingTypeDefs,
    paymentTypeDefs,
    reviewTypeDefs,
  ];
  const resolvers = [
    carResolvers,
    userResolvers,
    bookingResolvers,
    paymentResolvers,
    reviewResolvers,
  ];

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

  app.post("/api/payment/webhook", async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];
    const rawBody = req.rawBody;

    const success = await webhookHandler(signature, rawBody);

    if (success) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  });
}
