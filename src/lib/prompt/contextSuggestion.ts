import { z } from "zod";

export const buildContextSuggestionPrompt = (
  summaries: string[],
  messages: string[],
) => {
  const formattedSummaries =
    summaries.length > 0
      ? summaries.map((s) => `- ${s.trim()}`).join("\n")
      : "(none)";

  const formattedMessages =
    messages.length > 0
      ? messages.map((m) => `- ${m.trim()}`).join("\n")
      : "(none)";

  return `
You transform internal conversation context into high-quality public content ideas.
Use only the information provided.
Do not invent facts or assumptions.

Below is context derived from a single conversation.

PAST CONTEXT SUMMARIES:
${formattedSummaries}

RECENT MESSAGES:
${formattedMessages}

TASK:
Generate up to 2-4 high-quality content suggestions suitable for linkedin or x.

Guidelines:
- Each suggestion should represent a distinct topic or angle.
- Write for an external audience.
- Do not reference internal discussions or speakers.
- Keep descriptions short, clear, and practical.

Return data into plain texts.
`.trim();
};

export const ConversationContextSuggestionSchema = z.object({
  suggestions: z
    .array(
      z.object({
        topic: z
          .string()
          .describe(
            "The core idea or angle of the suggestion, suitable as a post topic or headline.",
          ),

        description: z
          .string()
          .describe(
            "A brief explanation of what the post would discuss, written for an external audience.",
          ),

        hashtags: z
          .array(z.string())
          .describe("Relevant hashtags that match the topic and platform."),

        signal: z
          .string()
          .optional()
          .describe(
            "Why this topic is interesting or valuable to share publicly.",
          ),
      }),
    )
    .min(1)
    .max(3)
    .describe(
      "A small set of high-quality content suggestions derived from the conversation.",
    ),
});
