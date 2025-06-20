
import { tool as createTool } from "ai";
import { z } from "zod";
import OpenAI from "openai";
import { exercises } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { db } from "@/server/db";
import { create } from "domain";

type GetExercisesInput = {
  refinedQuery: string;
  limit?: number
  muscleGroupsToInclude?: string[];
  muscleGroupsToExclude?: string[];

}

const openai = new OpenAI();

export const refineQueryTool = createTool({
  description: "Parse and refine the user's query to create a better queryEmbedding for exerciseTool",
  parameters: z.object({
    userQuery: z.string(),
  }),
  execute: async ({ userQuery }) => {
    console.log("refineQueryTool called")
    const result = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "You are a personal trainer assistant. Your job is to understand a user's workout request and output a structured query format for further processing."
        },
        {
          role: "user",
          content: `User query: "${userQuery}"`,
        },
        {
          role: "user",
          content: `Return a JSON object with the following fields:

{
  "refinedQueryForEmbedding": string, // A clear natural language query for vector search
  "muscleGroupsToInclude": string[], // e.g., ["quads", "glutes"]
  "muscleGroupsToExclude": string[], // e.g., ["calves"]
  "purpose": string, // e.g., "train for tennis", "rehab", "build size"
  "exerciseClassification": string // e.g., "functional", "postural", "bodybuilding", "cardio"
}`,
        },
      ],
    });

    const parsed = JSON.parse(result.choices[0]?.message.content || "{}")

    return parsed
  }
})

export const exerciseTool = createTool({
  description: "Retrieve exercises based on  Provide the query results only.",
  parameters: z.object({
    refinedQuery: z.string(),
    limit: z.number().optional().default(5),
    muscleGroupsToInclude: z.array(z.string()).optional(),
    muscleGroupsToExclude: z.array(z.string()).optional(),
  }),
  execute: async ({ refinedQuery, limit, muscleGroupsToExclude, muscleGroupsToInclude }: GetExercisesInput) => {
    console.log("🧠 TOOL CALLED with:", refinedQuery, limit);
    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: refinedQuery
    })

    console.log(`user query embedding created. Result:`, queryEmbedding)

    const queryVector = queryEmbedding.data[0]?.embedding
    console.log(`Query Vector:`, queryVector)
    if (!queryVector || queryVector.length === 0) {
      throw new Error("No embedding generated.");
    }
    // Format queryVector as a SQL array
    const vectorArray = `ARRAY[${queryVector.join(",")}]::vector`

    const whereParts: any[] = []

    if (muscleGroupsToInclude?.length) {
      whereParts.push(sql`"target_muscle_group" = ANY(${sql.raw(`'{${muscleGroupsToInclude.join(",")}}'`)})`);
    }

    if (muscleGroupsToExclude?.length) {
      whereParts.push(sql`LOWER("target_muscle_group") != ALL(${sql.raw(`ARRAY[${muscleGroupsToExclude.map(m => `'${m.toLowerCase()}'`).join(",")}]`)})`);
    }

    const whereClause = whereParts.length > 0 ? sql`WHERE ${sql.join(whereParts, sql` AND `)}` : sql``

    try {
      console.log(`Vector Array Slice:`, vectorArray.slice(0, 5), vectorArray.length)

      const retrievedExercises = await db.execute(sql`
            SELECT 
              ${exercises.id}, 
              ${exercises.exerciseName}, 
              ${exercises.description}, 
              ${exercises.targetMuscleGroup}, 
              ${exercises.youtubeDemoShortUrl}
            FROM ${exercises}
            ${whereClause}
            ORDER BY ${exercises.embedding} <-> ${sql.raw(vectorArray)}
            LIMIT ${limit} 
            `)
      console.log(`Retrieved exercises:`, retrievedExercises)

      const result = retrievedExercises?.map((exercise) => ({
        id: exercise.id,
        name: exercise.exercise_name,
        youtubeShort: exercise.youtube_demo_short_url,
        muscleGroup: exercise.target_muscle_group,
        description: exercise.description
      }))
      console.log("✅ TOOL RETURNING results:", result);
      return result
    } catch (err) {
      console.error("Failed to retrieve exercises", err)
    }
  }
})

export const tools = {
  giveWorkout: exerciseTool,
  refineQuery: refineQueryTool
};

