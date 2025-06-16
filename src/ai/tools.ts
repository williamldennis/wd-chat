import { tool as createTool } from "ai";
import { z } from "zod";

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

// export const getWeatherInformation = createTool({
//     description: 'show the weather in a given city to the user',
//     parameters: z.object({ city: z.string() }),
//     execute: async ({ }: { city: string }) => {
//         const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy']
//         return weatherOptions[
//             Math.floor(Math.random() * weatherOptions.length)
//         ]
//     }
// })

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

export const exerciseTool = createTool({
  description: "Give the user exercises. Don't include the URL in your description.",
  parameters: z.object({}),
  execute: async function ({ }) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { name: "Leg Press", youtube_short: "https://www.youtube.com/embed/5jDEulwWs04", muscle_group: "Chest" };
  },
});


export const tools = {
  displayWeather: weatherTool,
  getLocation: getLocation,
  askForConfirmation: askForConfirmation,
  giveWorkout: exerciseTool
  // getWeatherInformation: getWeatherInformation
};

