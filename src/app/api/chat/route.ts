import { openai } from '@ai-sdk/openai';
import { appendResponseMessages, streamText, type UIMessage } from 'ai'
import { saveChat } from '@/tools/chat-store';

type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
    id: string
}
//allow streaming response up to 30s
export const maxDuration = 30

export async function POST(req: Request) {
    const { messages, id } = await req.json() as { messages: ChatMessage[]; id: string }

    const result = streamText({
        model: openai('gpt-4-turbo'),
        system: 'You are a helpful assistant',
        messages,
        async onFinish({ response }) {
            await saveChat({
                id,
                messages: appendResponseMessages({
                    messages,
                    responseMessages: response.messages,
                })
            })
        }
    })

    return result.toDataStreamResponse()

}