'use client'

import { api } from "@/trpc/react"
import { user } from "auth-schema"

export default function HelloPage() {

    const result = api.post.hello.useQuery()



    return (
        <div className="text-white flex flex-col justify-center items-center h-screen">
            <div>sup fam</div>
            <div>{JSON.stringify(result.data?.greeting)}</div>
        </div>
    )
}