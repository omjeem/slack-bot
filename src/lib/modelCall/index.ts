import { generateObject, generateText } from "ai";
import { geminiModel } from "../aiClient";
import {
  buildConversationContextPrompt,
  ConversationContextSchema,
} from "../prompt/contextSummary";
import {
  buildContextSuggestionPrompt,
  ConversationContextSuggestionSchema,
} from "../prompt/contextSuggestion";

export const generateSummaryFromMessages = async (messages: string[]) => {
  try {
    const obj = await generateText({
      model: geminiModel,
      prompt: buildConversationContextPrompt(messages),
      temperature: 0.3,
    });
    console.dir({ obj }, { depth: null });
    return { summary: obj.text, usages: obj.usage };
  } catch (error: any) {
    console.log("Error in generating the summary", error);
    return null;
  }
};

export const generateSuggestionFromContext = async (
  summaries: string[],
  messages: string[],
) => {
  try {
    const obj = await generateText({
      model: geminiModel,
      // schema: ConversationContextSuggestionSchema,
      prompt: buildContextSuggestionPrompt(summaries, messages),
      // maxOutputTokens: 220,
      temperature: 0.3,
    });
    console.dir({ obj }, { depth: null });
    return { text: obj.text, usages: obj.usage };
  } catch (error: any) {
    console.log("Error in generating the Context", error);
    return null;
  }
};
