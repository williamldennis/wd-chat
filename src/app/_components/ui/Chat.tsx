'use client'

import { type Message, useChat } from '@ai-sdk/react'
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import { Weather } from './weather'


export default function Chat({
    id,
    initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {
    const { input, handleInputChange, handleSubmit, messages, addToolResult } =
        useChat({
            id, // use the provided chat ID
            initialMessages, // initial messages if provided
            sendExtraMessageFields: true, // send if and createdAt for each message
            maxSteps: 5,

            //run client side tools that are automatically executed
            async onToolCall({ toolCall }) {
                if (toolCall.toolName === 'getLocation') {
                    const cities = [
                        'New York',
                        'Los Angeles',
                        'Chicago',
                        'San Francisco'
                    ]
                    return cities[Math.floor(Math.random() * cities.length)]
                }
            }
        })

    return (
        <>
            <div className='flex flex-col items-center'>
                <div className='pt-30'>
                    <div className='text-2xl font-bold'>Chats</div>

                    {messages.map(message => (
                        <div
                            className='py-2 px-3 max-w-md bg-blue-100  my-2 rounded-xl'
                            key={message.id}>
                            <div className='font-bold text-sm'>
                                {message.role === 'user' ? 'User' : 'AI'}
                            </div>
                            {/* from tool usage */}
                            {message.parts.map(part => {
                                switch (part.type) {
                                    case 'text':
                                        return part.text

                                    case 'tool-invocation': {
                                        const callId = part.toolInvocation.toolCallId

                                        switch (part.toolInvocation.toolName) {
                                            case 'askForConfirmation': {
                                                const confirmationArgs = part.toolInvocation.args as { message: string }
                                                switch (part.toolInvocation.state) {
                                                    case 'call':
                                                        return (
                                                            <div key={callId}>
                                                                {confirmationArgs.message}
                                                                <div>
                                                                    <Button
                                                                        className='bg-green-400'
                                                                        onClick={() =>
                                                                            addToolResult({
                                                                                toolCallId: callId,
                                                                                result: 'Yes, confirmed',
                                                                            })
                                                                        }
                                                                    >
                                                                        Yes
                                                                    </Button>
                                                                    <Button
                                                                        className='m-4 bg-gray-400'
                                                                        onClick={() =>
                                                                            addToolResult({
                                                                                toolCallId: callId,
                                                                                result: 'No, denied',
                                                                            })
                                                                        }
                                                                    >
                                                                        No
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )
                                                    case 'result':
                                                        return (
                                                            <div key={callId}>
                                                                Location access allowed:{' '}
                                                                {part.toolInvocation.result}
                                                            </div>
                                                        )
                                                }
                                                break
                                            }
                                            case 'getLocation': {
                                                switch (part.toolInvocation.state) {
                                                    case 'call':
                                                        return <div key={callId}>Getting location...</div>
                                                    case 'result':
                                                        return (
                                                            <div key={callId}>
                                                                Location: {part.toolInvocation.result}
                                                            </div>
                                                        )
                                                }
                                                break
                                            }
                                            // case 'getWeatherInformation': {
                                            //     const weatherArgs = part.toolInvocation.args as { city: string }
                                            //     switch (part.toolInvocation.state) {
                                            //         case 'partial-call':
                                            //             return (
                                            //                 <pre key={callId}>
                                            //                     {JSON.stringify(part.toolInvocation, null, 2)}
                                            //                 </pre>
                                            //             )
                                            //         case 'call':
                                            //             return (
                                            //                 <div key={callId}>
                                            //                     Getting weather information for {' '}
                                            //                     {weatherArgs.city}...
                                            //                 </div>
                                            //             )
                                            //         case 'result':
                                            //             return (
                                            //                 <div key={callId}>
                                            //                     Weather in {weatherArgs.city}:{' '}
                                            //                     {part.toolInvocation.result}
                                            //                 </div>
                                            //             )
                                            //     }
                                            //     break
                                            // }
                                            case 'displayWeather': {
                                                switch (part.toolInvocation.state) {
                                                    case 'call':
                                                        return (
                                                            <div key={callId}>
                                                                Loading weather...
                                                            </div>
                                                        )
                                                    case 'result':
                                                        return (
                                                            <div key={callId}>
                                                                <Weather {...part.toolInvocation.result} />
                                                            </div>
                                                        )
                                                }
                                                break
                                            }
                                        }
                                    }
                                }
                            })}
                            <br />
                        </div>
                    ))}

                    <form className="flex justify-center mt-2" onSubmit={handleSubmit}>
                        <Input className="mr-2" name="prompt" value={input} onChange={handleInputChange} />
                        <Button className='' type="submit"> Submit</Button>
                    </form>

                </div>

            </div>

        </>
    )
}