import { NextResponse } from "next/server";
import { fetchLetterboxd } from "@/lib/rss";
import { readData } from "@/lib/db";
import type { BookEntry, TvEntry, FeedEntry } from "@/lib/types";

export const revalidate = 1800;

export async function GET() {
  const [movies, books, tv] = await Promise.all([
    fetchLetterboxd(),
    Promise.resolve(readData<BookEntry>("books")),
    Promise.resolve(readData<TvEntry>("tv")),
  ]);

  const feed: FeedEntry[] = [...movies, ...books, ...tv].sort(
    (a, b) => b.date.localeCompare(a.date)
  );

  return NextResponse.json(feed);
}
