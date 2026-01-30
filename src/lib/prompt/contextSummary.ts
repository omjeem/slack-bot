import { z } from "zod";

export const buildConversationContextPrompt = (messages: string[]) => {
  const formattedMessages = messages.map((m) => `- ${m.trim()}`).join("\n");
  return `
   You analyze internal conversations and produce reusable context summaries.
   Be concise, factual, and neutral.
   Do not invent information.
   Below is a sequence of messages from a single conversation, ordered chronologically.
      
   MESSAGES:
   ${formattedMessages}
      
   TASK:
   Create a compact context summary of this conversation.
   Focus on ideas, decisions, and themes.
   Ignore who said what.
   Return only a plain-text summary.   
`;
};

export const ConversationContextSchema = z
  .string()
  .describe(
    "A concise, factual summary of the conversation content. Capture key ideas, decisions, and themes discussed. Do not add new information.",
  );


