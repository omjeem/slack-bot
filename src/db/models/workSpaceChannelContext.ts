import mongoose from "mongoose";
import { required } from "zod/mini";

const WorkspaceChannelContextSchema = new mongoose.Schema(
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
    messageIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkspaceMessage",
      },
    ],
    summary: {
      type: String,
      required : true
    },
    inputTokens: {
      type: Number,
    },
    outputTokens: {
      type: Number,
    },
    totalTokens: {
      type: Number,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const WorkspaceChannelContextModal = mongoose.model(
  "WorkspaceChannelContext",
  WorkspaceChannelContextSchema,
);

export default WorkspaceChannelContextModal;
