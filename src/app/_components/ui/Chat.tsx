'use client'

import { type Message, useChat } from '@ai-sdk/react'
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import { Weather } from './weather'
import React, { useEffect, useRef } from 'react'

export default function Chat({
    id,
    initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {
    const { input, handleInputChange, handleSubmit, messages, addToolResult } = useChat({
        id,
        initialMessages,
        sendExtraMessageFields: true,
        maxSteps: 5,

        async onToolCall({ toolCall }) {
            if (toolCall.toolName === 'getLocation') {
                const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco']
                return cities[Math.floor(Math.random() * cities.length)]
            }
        }
    })

    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="flex flex-col h-screen">
            {/* Scrollable message area */}
            <div className="flex-1  overflow-auto p-4">
                <div className="text-2xl font-bold text-blue-200 mb-4 absolute">WD Chats</div>

                {messages.map(message => (
                    <div
                        className="py-2 px-3 max-w-md bg-blue-100 my-2 rounded-xl w-full mx-auto text-xs"
                        key={message.id}
                    >
                        <div className="font-bold ">
                            {message.role === 'user' ? 'User' : 'AI'}
                        </div>
                        {message.parts.map(part => {
                            switch (part.type) {
                                case 'text':
                                    return <div key={part.text}>{part.text}</div>

                                case 'tool-invocation': {
                                    const callId = part.toolInvocation.toolCallId

                                    switch (part.toolInvocation.toolName) {
                                        case 'askForConfirmation': {
                                            const args = part.toolInvocation.args as { message: string }
                                            switch (part.toolInvocation.state) {
                                                case 'call':
                                                    return (
                                                        <div key={callId}>
                                                            {args.message}
                                                            <div className="mt-2">
                                                                <Button
                                                                    className="bg-green-400 mr-2"
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
                                                                    className="bg-gray-400"
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
                                                            Location access allowed: {part.toolInvocation.result}
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

                                        case 'displayWeather': {
                                            switch (part.toolInvocation.state) {
                                                case 'call':
                                                    return (
                                                        <div key={callId}>Loading weather...</div>
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
                    </div>
                ))}

                {/* Invisible ref to scroll to */}
                <div ref={bottomRef} />
            </div>

            {/* Input form fixed at bottom */}
          
            <form
                onSubmit={handleSubmit}
                className="flex items-center justify-center p-4 border-t border-blue-950 bg-blue-950 sticky bottom-0"
            >
                  <div className='flex w-full max-w-md mx-auto'>
                <Input
                    className="flex mr-2 bg-white max-w-xs"
                    name="prompt"
                    value={input}
                    onChange={handleInputChange}
                />
                <Button type="submit">Submit</Button>
                  </div>

            </form>

        </div>
    )
}
