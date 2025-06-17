import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { env } from "@/env";

export const postRouter = createTRPCRouter({
  hello: protectedProcedure
    // .input(z.object({ text: z.string() }))
    .query(({ ctx }) => {
      return {
        greeting: `Hello ${ctx.user.name}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    console.warn(ctx);
    console.warn(ctx.db);
    console.warn(env.DATABASE_URL);
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),
});
