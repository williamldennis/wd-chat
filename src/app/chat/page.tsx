
'use client'

import { useChat } from '@ai-sdk/react'

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({})

    return (
        <>
            <div className='flex flex-col items-center'>
                <div className='pt-30'>
                    <div className='text-2xl font-bold'>Chats</div>

                    {messages.map(message => (
                        <div
                            className='py-2 max-w-md bg-blue-100 px-2 my-2 rounded-xl'
                            key={message.id}>
                            {message.role === 'user' ? 'User: ' : 'AI: '}
                            {message.content}
                        </div>
                    ))}

                    <form className="flex justify-center" onSubmit={handleSubmit}>
                        <input className="border py-2 px-6 rounded" name="prompt" value={input} onChange={handleInputChange} />
                        <button className='border py-2 ml-3 px-6 rounded bg-green-300' type="submit"> Submit</button>
                    </form>

                </div>

            </div>

        </>
    )

}