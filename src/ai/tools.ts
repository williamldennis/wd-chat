
import { tool as createTool } from "ai";
import { z } from "zod";
import { api, blockingClient } from "@/trpc/react"
import { createTRPCClient } from "@trpc/client";
import type { AppRouter } from "@/server/api/root";

const trpc = createTRPCClient<AppRouter>

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
//   description: "Give the user exercises. Don't include the URL in your description.",
//   parameters: z.object({}),
//   execute: async function ({ }) {
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     return {
//       id: "exampleId",
//       name: "Leg Press",
//       youtubeShort: "https://www.youtube.com/embed/5jDEulwWs04",
//       muscleGroup: "Chest"
//     };
//   },
// });


export const exerciseTool = createTool({
  description: "Give the user exercises from the DB based on their messages. Don't include the URL in your description.",
  parameters: z.object({}),
  execute: async function ({ }) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const exerciseList = await blockingClient.chat.exerciseList.query()
    console.log(`exercise TOOL CALL`, exerciseList)
    const result = exerciseList?.map((exercise) => ({
      id: exercise.id,
      name: exercise.exerciseName,
      youtubeShort: exercise.youtubeDemoShortUrl,
      muscleGroup: exercise.targetMuscleGroup
    }))
    return result
  },
});


export const tools = {
  displayWeather: weatherTool,
  getLocation: getLocation,
  askForConfirmation: askForConfirmation,
  giveWorkout: exerciseTool
};

