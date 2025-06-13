//create a client component (?)
//call the chat.list route in the chatRouter to get a list of chats
// display it in a side bar
// add <Sidebar /> to layout if user is logged in
'use client'

import { api } from "@/trpc/react"

export default function SidebarWD() {
    const { data: userChats, isLoading, error } = api.chat.list.useQuery()
    return (
        <>
            <div>
                <div className="bg-red-600 text-white">Chat List</div>
                <div className="text-white">
                    {userChats?.length === 0 ? (
                        <p> Start a chat </p>
                    ) : (
                        <ul className="space-y-2">
                            {userChats?.map((chat) => (
                                <li key={chat.id} className="bg-red-800 p-2 rounded">
                                    ChatID: {chat.id}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>

    )
}
