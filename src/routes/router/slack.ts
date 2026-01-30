import express from "express";
import { Controllers } from "@/controller";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { verifySlackRequest } from "@/middlewares/slackRequestMiddleware";

const slackRouter = express.Router();

slackRouter.get("/oauth/callback", Controllers.slack.callBack);

slackRouter.post("/events", verifySlackRequest, Controllers.slack.events);
slackRouter.post("/commands", Controllers.slack.commands);
slackRouter.get("/install", authMiddleware, Controllers.slack.install);
slackRouter.get(
  "/workspaces",
  authMiddleware,
  Controllers.slack.getUserWorkSpaces,
);
slackRouter.get(
  "/workspaces/channels/:teamId",
  authMiddleware,
  Controllers.slack.getAllWorkSpaceChannels,
);
slackRouter.get(
  "/workspaces/channels/messages/:teamId/:channelId",
  authMiddleware,
  Controllers.slack.getAllChannelsMessages,
);

slackRouter.get(
  "/workspaces/channels/suggestions/:teamId/:channelId",
  authMiddleware,
  Controllers.slack.generateSuggestionsFromConotext,
);

export default slackRouter;
