'use client'
import { api } from "@/trpc/react"

import { Calendar, ChevronUp, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import Chat from "@/components/ui/Chat"
import { user } from "auth-schema 2"
import { authClient } from "@/lib/auth-client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { log } from "console"

export function AppSidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      const session = await authClient.getSession()
      console.log(`user session: ${session.data?.user}`)
      setIsLoggedIn(!!session.data?.user)
    }

    checkAuth()


  }, [pathname])


  const { data: userChats, isLoading, error } = api.chat.list.useQuery(undefined, { enabled: isLoggedIn })
  const { data: user } = api.chat.userInfo.useQuery(undefined, { enabled: isLoggedIn })
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsLoggedIn(false)
          router.push("/login"); // redirect to login page
        },
      },
    });
  }
  if (isLoggedIn === false) return null



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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>

                  <div>{user?.name}</div>

                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                >
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}