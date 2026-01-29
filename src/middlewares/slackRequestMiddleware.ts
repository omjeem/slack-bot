import { envConfigs } from "@/config/envConfig";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";

export function verifySlackRequest(
  req: any,
  res: Response,
  next: NextFunction,
) {
  const slackSignature = req.headers["x-slack-signature"];
  const slackTimestamp = req.headers["x-slack-request-timestamp"];
  console.log({ slackSignature, slackTimestamp });
  if (!slackSignature || !slackTimestamp) {
    return res.status(401).send("Missing Slack headers");
  }

  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
  if (Number(slackTimestamp) < fiveMinutesAgo) {
    return res.status(401).send("Stale request");
  }

  const sigBaseString = `v0:${slackTimestamp}:${req.rawBody}`;
  console.log({ sigBaseString });
  const mySignature =
    "v0=" +
    crypto
      .createHmac("sha256", envConfigs.slack.clientSigningSecret)
      .update(sigBaseString, "utf8")
      .digest("hex");
  console.log({ mySignature });
  if (
    !crypto.timingSafeEqual(
      Buffer.from(mySignature, "utf8"),
      Buffer.from(slackSignature, "utf8"),
    )
  ) {
    return res.status(401).send("Invalid signature");
  }
  next();
}
