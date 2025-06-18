
import { tool as createTool } from "ai";
import { z } from "zod";
import OpenAI from "openai";
import { exercises } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { db } from "@/server/db";

type GetExercisesInput = {
  query: string;
  limit?: number
}

const openai = new OpenAI();

export const weatherTool = createTool({
  description: "Display the weather for a location",
  parameters: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async function ({ location }) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { weather: "Sunny", temperature: 75, location };
  },
});

export const askForConfirmation = createTool({
  description: "Ask the user for confirmation",
  parameters: z.object({
    message: z.string().describe("The message to ask for confirmation."),
  }),
});

export const getLocation = createTool({
  description:
    "get the user location. always ask for confirmation before using this tool",
  parameters: z.object({}),
});


// export const exerciseTool = createTool({
//   description: "Give the user exercises from the DB based on their messages. Don't include the URL in your description.",
//   parameters: z.object({
//     //give the model variables that it can use to define the db schema
//   }),
//   execute: async function ({ }) {
//     console.log('TOOL EXECUTING (non vector exercise)')
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     const exerciseList = await blockingClient.chat.exerciseList.query()
//     console.log(`exercise TOOL CALL`, exerciseList)
//     const result = exerciseList?.map((exercise) => ({
//       id: exercise.id,
//       name: exercise.exerciseName,
//       youtubeShort: exercise.youtubeDemoShortUrl,
//       muscleGroup: exercise.targetMuscleGroup
//     }))
//     return result
//   },
// });

// export const exerciseTool = createTool({
//   description: "Retrieve exercises semantically based on a natural language query from the user.",
//   parameters: z.object({
//     query: z.string(),
//     limit: z.number().optional().default(5)
//   }),
//   execute: async ({ query, limit }: GetExercisesInput) => {
//     console.log("🧠 TOOL CALLED with:", query, limit);
//     console.log("🧱 client methods:", Object.keys(blockingClient.chat));
//     const vectorQueryResult = await blockingClient.chat.exerciseListFromVector.query({
//       query,
//       limit: limit ?? 5
//     })
//     console.log(`exercise VECTOR TOOL CALL. Result:`, vectorQueryResult)
//     const result = vectorQueryResult?.map((exercise) => ({
//       id: exercise.id,
//       name: exercise.exerciseName,
//       youtubeShort: exercise.youtubeDemoShortUrl,
//       muscleGroup: exercise.targetMuscleGroup,
//       description: exercise.description
//     }))
//     console.log("✅ TOOL RETURNING results:", result);
//     return result
//   }
// })


export const exerciseTool = createTool({
  description: "Retrieve exercises semantically based on a natural language query from the user.",
  parameters: z.object({
    query: z.string(),
    limit: z.number().optional().default(5)
  }),
  execute: async ({ query, limit }: GetExercisesInput) => {
    console.log("🧠 TOOL CALLED with:", query, limit);
    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query
    })

    console.log(`user query embedding created. Result:`, queryEmbedding)

    const queryVector = queryEmbedding.data[0]?.embedding
    console.log(`Query Vector:`, queryVector)
    if (!queryVector || queryVector.length === 0) {
      throw new Error("No embedding generated.");
    }
    // Format queryVector as a SQL array
    const vectorArray = `ARRAY[${queryVector.join(",")}]::vector`

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
  displayWeather: weatherTool,
  getLocation: getLocation,
  askForConfirmation: askForConfirmation,
  giveWorkout: exerciseTool
};

