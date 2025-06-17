import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createChat } from "@/tools/chat-store";
import { db } from "@/server/db";
import { log } from "console";

export const chatRouter = createTRPCRouter({
    create: protectedProcedure
        .mutation(async ({ ctx }) => {
            console.log("INSIDE CREATE CHAT ROUTE")
            return await createChat(ctx.user.id)
        }),
    //create a list to grab all chats for a given user

    list: protectedProcedure.query(async ({ ctx }) => {
        const chatList = await ctx.db.query.chats.findMany({
            where: (chats, { eq }) => eq(chats.userId, ctx.user.id)
        })
        return chatList

    }),

    //user info
    userInfo: protectedProcedure.query(async ({ ctx }) => {
        const foundUser = await ctx.db.query.user.findFirst({
            where: (user, { eq }) => eq(user.id, ctx.user.id)
        })
        return foundUser

    }),

    exerciseList: protectedProcedure.query(async () => {
        console.log("exercise list tRPC")
        const retrievedExercises = await db.query.exercises.findMany({
            limit: 1,
        });
        return retrievedExercises

    }),

});
