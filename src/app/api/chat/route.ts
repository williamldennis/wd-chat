import { openai } from '@ai-sdk/openai';
import { appendResponseMessages, streamText } from 'ai'
import { saveChat } from '@/tools/chat-store'
import { z } from 'zod'
import { tools } from '@/ai/tools';

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
        maxSteps: 5,
        tools,
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