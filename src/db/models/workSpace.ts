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
  },
  { timestamps: true },
);

const WorkspaceModal = mongoose.model("Workspace", WorkspaceSchema);

export default WorkspaceModal;
