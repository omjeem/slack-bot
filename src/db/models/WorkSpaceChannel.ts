import mongoose from "mongoose";

const WorkspaceChannelSchema = new mongoose.Schema(
  {
    slackTeamId: {
      type: String,
      required: true,
      index: true,
    },
    channelId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const WorkspaceChannelModal = mongoose.model(
  "WorkspaceChannel",
  WorkspaceChannelSchema,
);

export default WorkspaceChannelModal;
