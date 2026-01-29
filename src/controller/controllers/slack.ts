import { envConfigs } from "@/config/envConfig";
import axios from "axios";
import { Request, Response } from "express";

export class slack {
  static callBack = async (req: Request, res: Response) => {
    const { code, state }: any = req.query;
    const userId = req.user?.userId || envConfigs.defaultToken;

    const savedState = req.cookies.slack_oauth_state;
    console.log({ savedState });

    if (!code || !state) {
      return res.status(400).send("Invalid OAuth state");
    }

    res.clearCookie("slack_oauth_state");

    try {
      const response = await axios.post(
        "https://slack.com/api/oauth.v2.access",
        new URLSearchParams({
          code,
          client_id: envConfigs.slack.clientId,
          client_secret: envConfigs.slack.clientSecret,
          redirect_uri: envConfigs.slack.redirectUrl,
        }),
      );

      if (!response.data.ok) {
        console.error(response.data);
        return res.status(400).send("OAuth failed");
      }
      const { team, access_token, bot_user_id } = response.data;

      console.log("✅ WORKSPACE CONNECTED");
      console.log("Team:", team.name);
      console.log("Team ID:", team.id);
      console.log("Bot User ID:", bot_user_id);
      console.log("Bot Token:", access_token);

      res.send(`
      <h2>Slack Connected ✅</h2>
      <p>Workspace: ${team.name}</p>
      <p>Check your server logs.</p>
    `);
    } catch (err) {
      console.error(err);
      res.status(500).send("OAuth error");
    }
  };

  static events = async (req: Request, res: Response) => {
    try {
      console.log("Request hit for events  ----");
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
  };
}
