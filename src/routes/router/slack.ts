import express from "express";
import { Controllers } from "@/controller";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { verifySlackRequest } from "@/middlewares/slackRequestMiddleware";

const slackRouter = express.Router();

slackRouter.get("/oauth/callback", Controllers.slack.callBack);

slackRouter.post("/events", verifySlackRequest, Controllers.slack.events);
slackRouter.post("/interactions", Controllers.slack.interaction);
slackRouter.get("/install", authMiddleware, Controllers.slack.install);

export default slackRouter;
