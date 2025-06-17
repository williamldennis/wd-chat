import { openai } from "@ai-sdk/openai";
import { appendResponseMessages, streamText } from "ai";
import { saveChat } from "@/tools/chat-store";
import { tools } from "@/ai/tools";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  id: string;
};
//allow streaming response up to 30s
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, id } = (await req.json()) as {
      messages: ChatMessage[];
      id: string;
    };

    const result = streamText({
      model: openai("gpt-4-turbo"),
      system: "You are a helpful assistant. Always use the 'giveWorkout' tool to generate exercises for the user when they mention working out or muscles.",
      messages,
      maxSteps: 5,
      tools,
      async onFinish({ response }) {
        await saveChat({
          id,
          messages: appendResponseMessages({
            messages,
            responseMessages: response.messages,
          }),
        });
      },
    });

    return result.toDataStreamResponse();
  } catch (err: unknown) {
    const error = err as Error

    console.error("🔥 /api/chat POST error:", {
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
      full: err,
    });

    return new Response("Internal Server Error", { status: 500 });
  }
}