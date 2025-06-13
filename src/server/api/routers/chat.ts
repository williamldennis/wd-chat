import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createChat } from "@/tools/chat-store";

export const chatRouter = createTRPCRouter({
    create: protectedProcedure
        .mutation(async ({ ctx }) => {
            console.log("INSIDE CREATE CHAT ROUTE")
            return await createChat(ctx.user.id)
        }),

});
