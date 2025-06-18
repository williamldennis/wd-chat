import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createChat } from "@/tools/chat-store";
import { db } from "@/server/db";
import { log } from "console";
import z from "zod";
import OpenAI from "openai";
import { exercises } from "@/server/db/schema";
import { sql } from "drizzle-orm";


const openai = new OpenAI();


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
        console.log("exercise list in tRPC")
        const retrievedExercises = await db.query.exercises.findMany({
            limit: 3,
        });
        return retrievedExercises

    }),

    // exerciseListFromVector: protectedProcedure
    //     .input(z.object({
    //         query: z.string(),
    //         limit: z.number().optional().default(5)
    //     }))
    //     .query(async ({ input, ctx }) => {
    //         console.log("exercise vector query in tRPC")
    //         const queryEmbedding = await openai.embeddings.create({
    //             model: "text-embedding-3-small",
    //             input: input.query
    //         })

    //         const queryVector = queryEmbedding.data[0]?.embedding

    //         const retrievedExercises = await db.execute(sql`
    //         SELECT ${exercises.id}, ${exercises.exerciseName}, ${exercises.description}, ${exercises.targetMuscleGroup}, ${exercises.youtubeDemoShortUrl}
    //         FROM ${exercises}
    //         ORDER BY ${exercises.embedding} <-> ${sql`${queryVector}`}
    //         LIMIT ${input.limit} 
    //         `)
    //         return retrievedExercises
    //     })
})