"use client";

import { useSearchParams } from "next/navigation";
import FeedItem from "./FeedItem";
import type { FeedEntry, ContentType } from "@/lib/types";

export default function FeedList({ entries }: { entries: FeedEntry[] }) {
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get("type") as ContentType | null;
  const minRating = searchParams.get("minRating");

  const filtered = entries.filter((e) => {
    if (typeFilter && e.type !== typeFilter) return false;
    if (minRating && (e.rating === undefined || e.rating < parseFloat(minRating))) return false;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 text-[#9ab]">
        <p className="text-4xl mb-3">🎞️</p>
        <p className="text-sm">No entries match your filters.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {filtered.map((entry) => (
        <FeedItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
