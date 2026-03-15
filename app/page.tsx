import { Suspense } from "react";
import { fetchLetterboxd } from "@/lib/rss";
import { readData } from "@/lib/db";
import type { BookEntry, TvEntry, FeedEntry } from "@/lib/types";
import FeedList from "@/components/FeedList";
import FilterBar from "@/components/FilterBar";

export const revalidate = 1800;

async function getFeed(): Promise<FeedEntry[]> {
  const [movies, books, tv] = await Promise.all([
    fetchLetterboxd(),
    Promise.resolve(readData<BookEntry>("books")),
    Promise.resolve(readData<TvEntry>("tv")),
  ]);
  return [...movies, ...books, ...tv].sort((a, b) => b.date.localeCompare(a.date));
}

export default async function Home() {
  const feed = await getFeed();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Feed</h1>
      <p className="text-sm text-[#9ab] mb-4">{feed.length} entries</p>
      <Suspense>
        <FilterBar />
        <div className="mt-3">
          <FeedList entries={feed} />
        </div>
      </Suspense>
    </div>
  );
}
