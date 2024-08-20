import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Application, json, Response, Request } from "express";
import cors from "cors";

import { carTypeDefs } from "../graphql/typeDefs/car.typeDefs";
import { carResolvers } from "../graphql/resolvers/car.resolvers";
import { userTypeDefs } from "../graphql/typeDefs/user.typeDefs";
import { userResolvers } from "../graphql/resolvers/user.resolvers";

export async function startApolloServer(app: Application) {
  const typeDefs = [carTypeDefs, userTypeDefs];
  const resolvers = [carResolvers, userResolvers];

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const apolloServer = new ApolloServer({
    schema,
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
        return { req, res };
      },
    })
  );
}
