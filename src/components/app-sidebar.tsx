'use client'
import { api } from "@/trpc/react"

import { ChevronDown, ChevronUp } from "lucide-react"

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
import { authClient } from "@/lib/auth-client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

export function AppSidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      const session = await authClient.getSession()
      console.log("user session:", session.data?.user)
      setIsLoggedIn(!!session.data?.user)
    }
    checkAuth().catch((err) => {
      console.error("Failed to check auth:", err);
    });
  }, [pathname])


  const { data: userChats } = api.chat.list.useQuery(undefined, { enabled: isLoggedIn })
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
    <Sidebar
      variant="floating"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Today`&apos`s Workout

            </SidebarGroupLabel>

          </SidebarGroupContent>
        </SidebarGroup>
        <Collapsible className="group/collapsible">

          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                History<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
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
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
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