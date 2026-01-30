import express from "express";
import { Controllers } from "@/controller";
import { verifySlackRequest } from "@/middlewares/slackRequestMiddleware";

const slackRouter = express.Router();

slackRouter.get("/oauth/callback", Controllers.slack.callBack);
slackRouter.post("/events", verifySlackRequest, Controllers.slack.events);
slackRouter.post("/commands", Controllers.slack.commands);
slackRouter.get("/install", Controllers.slack.install);

export default slackRouter;
