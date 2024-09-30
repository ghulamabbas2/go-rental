import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "config/.env.local" });

import cookieParser from "cookie-parser";
import { dbConnect } from "./config/dbConnect";
import { startApolloServer } from "./apollo/apolloServer";

const app = express();

app.use(
  express.json({
    limit: "10mb",
    verify: (req: express.Request, res: express.Response, buf: Buffer) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(cookieParser());

dbConnect();

app.get("/", (req, res) => {
  res.send("Hello World");
});

async function startServer() {
  await startApolloServer(app);
}

startServer();
