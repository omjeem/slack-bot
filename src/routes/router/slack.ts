import express from "express";
import { Controllers } from "@/controller";

const slackRouter = express.Router();

slackRouter.get("/oauth/callback", Controllers.slack.callBack);

slackRouter.post("/events", Controllers.slack.events);
slackRouter.post("/interactions", Controllers.slack.interaction);
slackRouter.get("/install", Controllers.slack.install);

export default slackRouter;
