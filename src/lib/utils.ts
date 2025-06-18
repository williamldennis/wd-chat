import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Handle watch?v=ID
    if (parsed.hostname.includes("youtube.com") && parsed.pathname === "/watch") {
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }

    // Handle youtu.be/ID
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }

    return url; // already in embed format or unrecognized
  } catch {
    return "";
  }
}