import { openai } from '@ai-sdk/openai';
import { appendResponseMessages, streamText } from 'ai'
import { saveChat } from '@/tools/chat-store'
import { z } from 'zod'

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
        tools: {
            getWeatherInformation: {
                description: 'show the weather in a given city to the user',
                parameters: z.object({ city: z.string() }),
                execute: async ({ }: { city: string }) => {
                    const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy']
                    return weatherOptions[
                        Math.floor(Math.random() * weatherOptions.length)
                    ]
                }
            },
            askForConfirmation: {
                description: 'Ask the user for confirmation',
                parameters: z.object({
                    message: z.string().describe('The message to ask for confirmation.')
                })
            },
            getLocation: {
                description: 'get the user location. always ask for confirmation before using this tool',
                parameters: z.object({})
            }
        },
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