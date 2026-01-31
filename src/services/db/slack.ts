import Constants from "@/config/constants";
import WorkspaceModal from "@/db/models/workSpace";
import WorkspaceChannelModal from "@/db/models/WorkSpaceChannel";
import WorkspaceChannelContextModal from "@/db/models/workSpaceChannelContext";
import WorkspaceMessageModal from "@/db/models/WorkSpaceMessages";
import {
  generateSuggestionFromContext,
  generateSummaryFromMessages,
} from "@/lib/modelCall";

export class slack {
  static createWorkSpace = async (body: {
    slackTeamId: string;
    teamName: string;
    botUserId: string;
    botToken: string;
  }) => {
    return await WorkspaceModal.create(body);
  };

  static getWorkSpaceByTeamId = async (teamId: string) => {
    return await WorkspaceModal.findOne({ slackTeamId: teamId });
  };

  static updateWorkSpaceData = async (body: {
    slackTeamId: string;
    data: {
      teamName?: string;
      botUserId?: string;
      botToken?: string;
    };
  }) => {
    console.log("Updating the details --- ", { body });
    return await WorkspaceModal.updateOne(
      { slackTeamId: body.slackTeamId },
      {
        ...(body.data.teamName && { teamName: body.data.teamName }),
        ...(body.data.botUserId && { botUserId: body.data.botUserId }),
        ...(body.data.botToken && { botToken: body.data.botToken }),
      },
    );
  };

  static addNewChannel = async (body: {
    slackTeamId: string;
    channelId: string;
  }) => {
    console.log({ body });
    const isChannelExists = await WorkspaceChannelModal.findOne({
      slackTeamId: body.slackTeamId,
      channelId: body.channelId,
    });

    if (!isChannelExists) {
      const createNewChannel = await WorkspaceChannelModal.create({
        slackTeamId: body.slackTeamId,
        channelId: body.channelId,
      });
      console.log("New Channel Created", { createNewChannel });
    } else {
      console.log("Channel Already Exists", { isChannelExists });
    }
  };

  static addNewChat = async (body: {
    slackTeamId: string;
    channelId: string;
    msgUserId: string;
    message: string;
    eventId: string;
    channelType: string;
  }) => {
    const addNewChat = await WorkspaceMessageModal.create(body);
    console.log({ addNewChat });
  };

  static getAllWorkSpaceChannels = async (teamId: string) => {
    return await WorkspaceChannelModal.find({ slackTeamId: teamId });
  };

  static getAllChannelMessages = async (body: {
    slackTeamId: string;
    channelId: string;
    isProcessed?: boolean;
  }) => {
    const conditions: any = {
      slackTeamId: body.slackTeamId,
      channelId: body.channelId,
    };
    if (typeof body.isProcessed === "boolean") {
      conditions.isProcessed = body.isProcessed;
    }
    return await WorkspaceMessageModal.find({ ...conditions })
      .sort({
        createdAt: 1,
      })
      .select("_id message isProcessed createdAt");
  };

  static generateSummaryIfSufficient = async (body: {
    slackTeamId: string;
    channelId: string;
  }) => {
    const tokensInfo = await this.getTokenConsumption(body.slackTeamId);
    if (tokensInfo && tokensInfo.tokensUsed > tokensInfo.tokensLimit) {
      console.log("Tokens limit reached ---- ", { tokensInfo });
      return;
    }
    const messages = await this.getAllChannelMessages({
      slackTeamId: body.slackTeamId,
      channelId: body.channelId,
      isProcessed: false,
    });
    console.log({ messages });
    if (messages.length >= Constants.AI_PROCESSING.SUMMARY_MSG_LIMIT) {
      const messagesText = messages.map((m) => m.message);
      const messageIds = messages.map((m) => m._id);
      const summaryData = await generateSummaryFromMessages(messagesText);
      console.log({ summaryData });
      if (!summaryData) return;
      const { summary, usages } = summaryData;
      const { inputTokens = 0, outputTokens = 0, totalTokens = 0 } = usages;

      const summaryFeed = await WorkspaceChannelContextModal.create({
        slackTeamId: body.slackTeamId,
        channelId: body.channelId,
        messageIds,
        summary,
        inputTokens,
        outputTokens,
        totalTokens,
      });

      await WorkspaceMessageModal.updateMany(
        { _id: { $in: messageIds.map((m) => m._id) } },
        { $set: { isProcessed: true } },
      );
      await this.updateWorkSpaceTokens({
        slackTeamId: body.slackTeamId,
        totalTokens,
      });
      console.log({ summaryFeed });
    }
  };

  static updateWorkSpaceTokens = async (body: {
    slackTeamId: string;
    totalTokens: Number;
  }) => {
    await WorkspaceModal.updateOne(
      { slackTeamId: body.slackTeamId },
      { $inc: { tokensUsed: body.totalTokens } },
    );
  };

  static generateSuggestionsFromContext = async (body: {
    slackTeamId: string;
    channelId: string;
    response_url: string;
  }) => {
    const tokensInfo = await this.getTokenConsumption(body.slackTeamId);
    let sendInfo;
    if (tokensInfo && tokensInfo.tokensUsed > tokensInfo.tokensLimit) {
      sendInfo = `
      You’ve reached your token limit. Please contact omjeem558@gmail.com to request additional tokens.
    `;
    } else {
      const workSpaceContexts = await WorkspaceChannelContextModal.find({
        slackTeamId: body.slackTeamId,
        channelId: body.channelId,
      }).sort({
        createdAt: -1,
      });
      const messagesData = await this.getAllChannelMessages({
        slackTeamId: body.slackTeamId,
        channelId: body.channelId,
        isProcessed: false,
      });

      const summaries = workSpaceContexts.map((m) => m.summary);
      const messages = messagesData.map((m) => m.message);
      console.log({ workSpaceContexts, messages });

      const suggestionsData = await generateSuggestionFromContext(
        summaries,
        messages,
      );
      if (!suggestionsData) return;
      console.log({ suggestionsData });
      const { text, usages } = suggestionsData;
      const { totalTokens = 0, inputTokens = 0, outputTokens = 0 } = usages;
      sendInfo = text;
      await this.updateWorkSpaceTokens({
        slackTeamId: body.slackTeamId,
        totalTokens,
      });
    }

    await fetch(body.response_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response_type: "ephemeral",
        text: sendInfo,
      }),
    });
  };

  static sendConsumedTokensOfWorkSpace = async (body: {
    teamId: string;
    responseUrl: string;
  }) => {
    const tokensInfo = await this.getTokenConsumption(body.teamId);
    let consumedTokens = 0;
    if (tokensInfo) {
      const { tokensUsed, tokensLimit } = tokensInfo;
      consumedTokens = tokensUsed;
    }
    console.log({ consumedTokens });
    await fetch(body.responseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response_type: "ephemeral",
        text: consumedTokens,
      }),
    });
  };

  private static getTokenConsumption = async (teamId: string) => {
    return await WorkspaceModal.findOne({ slackTeamId: teamId }).select(
      "tokensUsed tokensLimit",
    );
  };
}
