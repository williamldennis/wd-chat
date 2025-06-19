import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function MenuBarNav() {
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
        <Menubar className="bg-white/40 backdrop-blur-lg border">
            <MenubarMenu>
                <MenubarTrigger>Profile</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={handleSignOut}
                    >
                        <span>Sign out</span>
                    </MenubarItem>

                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Workout History</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        Coming Soon
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}
