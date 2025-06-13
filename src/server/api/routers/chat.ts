import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createChat } from "@/tools/chat-store";

export const chatRouter = createTRPCRouter({
    create: protectedProcedure
        .mutation(async ({ ctx }) => {
            console.log("INSIDE CREATE CHAT ROUTE")
            return await createChat(ctx.user.id)
        }),

    list: protectedProcedure.query(async ({ ctx }) => {
        const chatList = await ctx.db.query.chats.findMany({
            where: (chats, { eq }) => eq(chats.userId, ctx.user.id)
        })
        return chatList

    }),
    //create a list to grab all chats for a given user

});
