import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mainRouter from "./routes";
import { envConfigs } from "./config/envConfig";
import connectMongoDb from "./db";

const app = express();
app.use(cors());
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString("utf8");
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  return res.send("Welcome to Slack bot api!");
});

app.use("/api", mainRouter);

app.listen(envConfigs.port, async () => {
  console.log(`Server is Running", "http://localhost:${envConfigs.port}`);
  await connectMongoDb();
});
