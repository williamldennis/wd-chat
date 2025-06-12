import { generateId } from "ai";
import { type Message } from "ai";
import { db } from "@/server/db";
import { chats } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function loadChat(id: string): Promise<Message[]> {
  try {
    const result = await db
      .select({ messages: chats.messages })
      .from(chats)
      .where(eq(chats.id, id))
      .limit(1);

    return result[0]?.messages ?? [];
  } catch (error) {
    console.error("Error loading chat:", error);
    return [];
  }
}

export async function createChat(): Promise<string> {
  const id = generateId(); //generate unique chat ID
  try {
    await db.insert(chats).values({
      id,
      messages: [],
    });
    return id;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  try {
    await db
      .update(chats)
      .set({
        messages,
        updatedAt: new Date(),
      })
      .where(eq(chats.id, id));
  } catch (error) {
    console.error("Error saving chat", error);
    throw error;
  }
}
