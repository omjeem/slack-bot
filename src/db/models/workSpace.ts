import mongoose from "mongoose";

const WorkspaceSchema = new mongoose.Schema(
  {
    slackTeamId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    teamName: {
      type: String,
      required: true,
    },

    botUserId: {
      type: String,
      required: true,
    },

    botToken: {
      type: String,
      required: true,
    },

    installedBy: {
      type: String,
    },

    settings: {
      trackPublicChannels: { type: Boolean, default: true },
      trackPrivateChannels: { type: Boolean, default: true },
      trackDMs: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

const Workspace = mongoose.model("Workspace", WorkspaceSchema);

export default Workspace;
