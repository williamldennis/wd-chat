"use server";

import { log } from "console";
import { auth } from "../lib/auth";

export const signIn = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });
        return {
            success: true,
            message: "Signed in successfully"
        }
        console.log("Successfully signed in")
    } catch (error) {
        const e = error as Error
        return {
            success: false,
            message: { error: e.message || "Unknown error during sign in"}
        }
    }
};

export const signUp = async () => {
  await auth.api.signUpEmail({
    body: {
      email: "test@example.com",
      password: "password123",
      name: "Will Dennis",
    },
  });
};
