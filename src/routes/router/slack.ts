import { envConfigs } from "@/config/envConfig";
import express, { Request, Response } from "express";
import crypto from "crypto";
import axios from "axios";
import { Controllers } from "@/controller";
import { authMiddleware } from "@/middlewares/authMiddleware";

const slackRouter = express.Router();

slackRouter.get(
  "/oauth/callback",
  Controllers.slack.callBack
);

slackRouter.post("/api/slack/events", Controllers.slack.events);

slackRouter.post("/api/slack/interactions", (req: Request, res: Response) => {
  try {
    console.log("Request hit for interactions  ----");
    console.log("Query", req.query);
    console.log("Params", req.params);
    console.log("Body", req.body);

    return res.send(req.body.challenge);
  } catch (error: any) {
    console.log("Error in callback", error);
    return res.status(400).json({
      message: "Error Occcures",
    });
  }
});

function generateState() {
  return crypto.randomBytes(16).toString("hex");
}

slackRouter.get("/api/slack/install", (req, res) => {
  const state = generateState();

  res.cookie("slack_oauth_state", state);

  console.log({ state });
  const params = new URLSearchParams({
    client_id: envConfigs.slack.clientId,
    scope: [
      "channels:read",
      "channels:history",
      "users:read",
      "chat:write",
      "im:history",
      "groups:history",
    ].join(","),
    redirect_uri: envConfigs.slack.redirectUrl,
    state,
  });

  res.redirect(`https://slack.com/oauth/v2/authorize?${params}`);
});

export default slackRouter;
