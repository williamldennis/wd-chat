import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "superbod",
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
      <body className="bg-background text-foreground font-sans antialiased">

        <TRPCReactProvider>
          {/* <SidebarTrigger
              className="z-0" /> */}

          {children}


          <Toaster />
        </TRPCReactProvider>


      </body>
    </html>
  );
}
