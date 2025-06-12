import { betterAuth } from "better-auth";
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
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID!, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!, 
        }, 
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});
