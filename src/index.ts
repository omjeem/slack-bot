import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mainRouter from "./routes";
import { envConfigs } from "./config/envConfig";
import connectMongoDb from "./db";
import path from "path";

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
  res.sendFile(path.join(process.cwd(), "public/index.html"));
});

app.use("/api", mainRouter);

app.listen(envConfigs.port, "0.0.0.0", async () => {
  console.log(`Server is running On", "http://localhost:${envConfigs.port}`);
  await connectMongoDb();
});
