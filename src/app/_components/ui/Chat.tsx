'use client'

import { type Message, useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Chat({
    id,
    initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {
    const { input, handleInputChange, handleSubmit, messages } = useChat({
        id, // use the provided chat ID
        initialMessages, // initial messages if provided
        sendExtraMessageFields: true, // send if and createdAt for each message
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
                            {message.content}
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