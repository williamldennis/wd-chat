import { redirect } from "next/navigation";
import { api } from "@/trpc/server";

export default async function ChatPage() {
  // does TRPC already have the request context if I make a server side request?
  const chatId = await api.chat.create()
  redirect(`/chat/${chatId}`);
}
