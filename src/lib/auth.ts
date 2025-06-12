import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../server/db/index"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    minPasswordLength: 8,
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});
