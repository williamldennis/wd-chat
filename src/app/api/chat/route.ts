import { openai } from '@ai-sdk/openai';
import { streamText, type UIMessage } from 'ai'

type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string
}
//allow streaming response up to 30s
export const maxDuration = 30

export async function POST(req: Request) {
    const { messages } = await req.json() as { messages: ChatMessage[] }

    const result = streamText({
        model: openai('gpt-4-turbo'),
        system: 'You are a helpful assistant',
        messages,
    })

    return result.toDataStreamResponse()

}