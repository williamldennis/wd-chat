//create a client component (?)
//call the chat.list route in the chatRouter to get a list of chats
// display it in a side bar
// add <Sidebar /> to layout if user is logged in
'use client'

import { api } from "@/trpc/react"

export default function Sidebar() {
    const userChats = api.chat.list.useQuery()

    return (
        <>
            <div className="bg-red-600">side bar here why no text</div>
            <div>
                {JSON.stringify(userChats)}
            </div>

        </>

    )
}
