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

    const result = streamText<typeof tools>({
      model: openai("gpt-4-turbo"),
      system: "You are a fitness assistant. Always start with 'refineQueryTool' to interpret and structure the user's request. Then call 'exerciseTool' with the refinedQueryForEmbedding.",
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
    console.log("🛠️ Tool used api/chat/route");
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