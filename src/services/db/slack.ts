import WorkspaceModal from "@/db/models/workSpace";
import WorkspaceChannelModal from "@/db/models/WorkSpaceChannel";
import WorkspaceMessageModal from "@/db/models/WorkSpaceMessages";

export class slack {
  static createWorkSpace = async (body: {
    slackTeamId: string;
    teamName: string;
    botUserId: string;
    botToken: string;
    installedBy: string;
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
      installedBy?: string;
    };
  }) => {
    console.log("Updating the details --- ", { body });
    return await WorkspaceModal.updateOne(
      { slackTeamId: body.slackTeamId },
      {
        ...(body.data.teamName && { teamName: body.data.teamName }),
        ...(body.data.botUserId && { botUserId: body.data.botUserId }),
        ...(body.data.botToken && { botToken: body.data.botToken }),
        ...(body.data.installedBy && { installedBy: body.data.installedBy }),
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
    userId: string;
    message: string;
    eventId: string;
    channelType: string;
  }) => {
    const addNewChat = await WorkspaceMessageModal.create(body);
    console.log({ addNewChat });
  };
}
