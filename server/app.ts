import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnect } from "./config/dbConnect";
import { startApolloServer } from "./apollo/apolloServer";
dotenv.config({ path: "config/.env.local" });

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

const PORT = process.env.PORT || 4000;
async function startServer() {
  await startApolloServer(app);
  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT} at http://localhost:${PORT}`
    );
  });
}

startServer();
