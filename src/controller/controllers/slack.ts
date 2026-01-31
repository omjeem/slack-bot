import { envConfigs } from "@/config/envConfig";
import { errorResponse, successResponse } from "@/config/response";
import { Services } from "@/services";
import axios from "axios";
import { Request, Response } from "express";

export class slack {
  static callBack = async (req: Request, res: Response) => {
    const { code, state }: any = req.query;

    if (!code) {
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

      const slackTeamId = team.id;
      const teamName = team.name;
      const botUserId = bot_user_id;
      const botToken = access_token;

      console.log("✅ WORKSPACE CONNECTED");
      console.log("Team:", teamName);
      console.log("Team ID:", slackTeamId);
      console.log("Bot User ID:", botUserId);
      console.log("Bot Token:", botToken);

      let finalData;
      const workSpaceData =
        await Services.slack.getWorkSpaceByTeamId(slackTeamId);
      if (!workSpaceData) {
        const finalData = await Services.slack.createWorkSpace({
          slackTeamId,
          teamName,
          botToken,
          botUserId,
        });
        console.log("Newly Created", { finalData });
      } else {
        finalData = await Services.slack.updateWorkSpaceData({
          slackTeamId: team.id,
          data: {
            teamName,
            botToken,
            botUserId,
          },
        });
        console.log("Updated", { finalData });
      }

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

  static commands = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      console.log("Body is", body);
      const { team_id, channel_id, command, text, response_url } = body;
      let message = "Invalid command";
      if (command === "/suggest") {
        message = "Generating articles suggestions… ⏳";
        Services.slack.generateSuggestionsFromContext({
          slackTeamId: team_id,
          channelId: channel_id,
          response_url,
        });
      } else if (command === "/tokens") {
        message = "Fetching total tokens consumed by our Workspace";
        Services.slack.sendConsumedTokensOfWorkSpace({
          teamId: team_id,
          responseUrl: response_url,
        });
      }
      res.json({
        response_type: "ephemeral",
        text: message,
      });
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static events = async (req: Request, res: Response) => {
    try {
      console.log("Request hit for events  ----");
      console.log("Body", req.body);
      const {
        token,
        team_id,
        context_team_id,
        api_app_id,
        event,
        type,
        event_id,
        event_time,
      } = req.body;

      if (type === "url_verification") {
        return res.send(req.body.challenge);
      }

      const eventType = event.type;
      const eventSubType = event.subtype;
      const eventUser = event.user;
      const eventTs = event.ts;
      const eventClientMsgId = event.client_msg_id;
      const eventText = event.text;
      const eventChannel = event.channel;
      const eventChannelType = event.channel_type;

      await Services.slack.addNewChannel({
        slackTeamId: team_id,
        channelId: eventChannel,
      });

      if (eventSubType === "channel_join") {
        console.log("Channel is added if not exists");
      } else if (eventType === "message") {
        await Services.slack.addNewChat({
          slackTeamId: team_id,
          channelId: eventChannel,
          msgUserId: eventUser,
          message: eventText,
          eventId: event_id,
          channelType: eventChannelType,
        });
        Services.slack.generateSummaryIfSufficient({
          slackTeamId: team_id,
          channelId: eventChannel,
        });
      }

      return res.send(1);
    } catch (error: any) {
      console.log("Error in callback", error);
      return res.status(400).json({
        message: "Error Occcures",
      });
    }
  };

  static install = async (req: Request, res: Response) => {
    const params = new URLSearchParams({
      client_id: envConfigs.slack.clientId,
      scope: [
        "channels:read",
        "channels:history",
        "users:read",
        "chat:write",
        "im:history",
        "groups:history",
        "commands",
      ].join(","),
      redirect_uri: envConfigs.slack.redirectUrl,
    });
    res.redirect(`https://slack.com/oauth/v2/authorize?${params}`);
  };
}
