import Parser from "rss-parser";
import type { MovieEntry } from "./types";
import { readData, writeData } from "./db";

type LetterboxdItem = {
  title: string;
  link: string;
  content: string;
  watchedDate?: string;
  filmTitle?: string;
  filmYear?: string;
  memberRating?: string;
};

const parser = new Parser<Record<string, unknown>, LetterboxdItem>({
  customFields: {
    item: [
      ["letterboxd:watchedDate", "watchedDate"],
      ["letterboxd:filmTitle", "filmTitle"],
      ["letterboxd:filmYear", "filmYear"],
      ["letterboxd:memberRating", "memberRating"],
    ],
  },
});

function extractPoster(description: string): string | undefined {
  const match = description.match(/<img[^>]+src="([^"]+)"/i);
  return match?.[1];
}

function extractReview(description: string): string | undefined {
  // Strip all HTML tags
  const text = description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  // Remove "Watched DD Mon YYYY" prefix that Letterboxd always adds
  const cleaned = text.replace(/^Watched\s+\d{1,2}\s+\w+\s+\d{4}\.?\s*/i, "").trim();
  return cleaned.length > 0 ? cleaned : undefined;
}

export async function fetchLetterboxd(): Promise<MovieEntry[]> {
  const existing = readData<MovieEntry>("movies");
  const existingById = new Map(existing.map((m) => [m.id, m]));

  try {
    const feed = await parser.parseURL("https://letterboxd.com/bigchuckb/rss/");
    for (const item of feed.items) {
      const id = item.link ?? item.title;
      if (!existingById.has(id)) {
        existingById.set(id, {
          id,
          type: "movie" as const,
          title: item.filmTitle ?? item.title,
          date: item.watchedDate ?? new Date().toISOString().slice(0, 10),
          rating: item.memberRating ? parseFloat(item.memberRating) : undefined,
          notes: item.content ? extractReview(item.content) : undefined,
          letterboxdUrl: item.link ?? "",
          posterUrl: item.content ? extractPoster(item.content) : undefined,
          filmYear: item.filmYear ? parseInt(item.filmYear) : undefined,
        });
      }
    }
  } catch {
    // Return what we have persisted if fetch fails
  }

  const merged = Array.from(existingById.values()).sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  writeData("movies", merged);
  return merged;
}
