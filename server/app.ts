import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "config/.env.local" });

import cookieParser from "cookie-parser";
import { dbConnect } from "./config/dbConnect";
import { startApolloServer } from "./apollo/apolloServer";
import path from "path";

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

// Serve Frontend
if (process.env.NODE_ENV === "production") {
  // Set build folder as static folder
  app.use(express.static(path.join(__dirname, "../../client/build")));

  app.get("*", (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  });
}

async function startServer() {
  await startApolloServer(app);
}

startServer();
