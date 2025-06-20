#TO DO 
[X] Associate chats with a given userID
[X] Add userID to chat table
[X] Finish writing function for grabbing all chats by userID [text](src/server/api/routers/chat.ts)
[X] add log out button
[X] remove chat list for logged out users
[X] on log in, load chat list
[X] make the list of exercises live outside the chat
[X] add exercises to db
[X] vector index the exercises
[X] create tool for chat to grab exercises based on vector similarity to user request
[X] return exercises in UI
[X] make those exercises have GenUI components
[X] style the log in and sign up pages
[X] fix deploy
[X] create intro message
[X] style workout page
[X] fix appostrophes and quotes lol
[X] hide form when exercise card is open
[X] fix exercise drawer close making chat drawer open
[X] make it look good on mobile (drawer for chat?)
[X] menu bar is missing
[X] get auth working in prod

[] make the chat less verbose
[] adjust carousel for short height
[] adjust card for short height
[] menu bar broken / fix sign out button hover
[] improve input handling for chat submission
[] make target muscle tag bg match muscle image color

NOT REQUIRED FOR PORTFOLIO
[] add a 'workout progress' tracker - exercises completed / exercises remaining b
[] add reps and weight for exercises
[] "give me some abs and back exercises" gave me just abs exercises
[] create summary message for a given workout
[] fix chevron on history
[] turn chats into daily workout sessions
[] have sessions contain exercises
[] track exercise completion to history 
[] have a calendar / dashboard for progress
[] fatigue by muscle group
[] in take session 



----
# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
