import WorkspaceModal from "@/db/models/workSpace";

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
}
