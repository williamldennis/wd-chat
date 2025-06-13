'use client'
import { api } from "@/trpc/react"

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Chat from "@/app/_components/ui/Chat"


export function AppSidebar() {

  const { data: userChats, isLoading, error } = api.chat.list.useQuery()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>WD Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userChats?.length === 0 ? (
                <p> Start a chat </p>
              ) : (
                <ul className="space-y-2">
                  {userChats?.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton asChild>

                        <span>{chat.id}</span>

                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </ul>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}