import mongoose from "mongoose";

const WorkspaceMessageSchema = new mongoose.Schema(
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
    msgUserId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
    },
    channelType: {
      type: String,
      required: true,
    },
    isProcessed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const WorkspaceMessageModal = mongoose.model(
  "WorkspaceMessage",
  WorkspaceMessageSchema,
);

export default WorkspaceMessageModal;
