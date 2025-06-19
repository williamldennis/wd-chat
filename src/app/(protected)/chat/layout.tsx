// app/(protected)/layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            {/* <AppSidebar /> */}
            {children}
        </SidebarProvider>
    );
}
