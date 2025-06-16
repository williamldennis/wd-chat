import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import { TRPCReactProvider } from "@/trpc/react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Bod by Bot",
  description: "Build your body for strength, injusry prevention, or a great butt. Whatever you want, bot is here to help.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>

        <TRPCReactProvider>
          {children}
            <SidebarProvider>
              <AppSidebar />
              <SidebarTrigger />
            </SidebarProvider>
          <Toaster />
        </TRPCReactProvider>


      </body>
    </html>
  );
}
