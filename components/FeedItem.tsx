import Image from "next/image";
import StarRating from "./StarRating";
import type { FeedEntry } from "@/lib/types";

const TYPE_CONFIG = {
  movie: { label: "Film", accent: "border-[#00e054]", badge: "bg-[#00e054]/10 text-[#00e054]" },
  book: { label: "Book", accent: "border-[#40bcf4]", badge: "bg-[#40bcf4]/10 text-[#40bcf4]" },
  tv: { label: "TV", accent: "border-[#ff8000]", badge: "bg-[#ff8000]/10 text-[#ff8000]" },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function FeedItem({ entry }: { entry: FeedEntry }) {
  const config = TYPE_CONFIG[entry.type];

  return (
    <div className={`flex gap-4 p-4 bg-[#2c3440] rounded border-l-2 ${config.accent}`}>
      <div className="flex-shrink-0">
        {entry.type === "movie" ? (
          entry.posterUrl ? (
            <a href={entry.letterboxdUrl} target="_blank" rel="noopener noreferrer">
              <Image src={entry.posterUrl} alt={entry.title} width={52} height={78}
                className="rounded object-cover hover:opacity-80 transition-opacity" />
            </a>
          ) : (
            <div className="w-[52px] h-[78px] rounded bg-[#1e2530] flex items-center justify-center text-[#445566] text-lg">🎬</div>
          )
        ) : entry.type === "book" ? (
          entry.coverUrl ? (
            <Image src={entry.coverUrl} alt={entry.title} width={52} height={78}
              className="rounded object-cover" />
          ) : (
            <div className="w-[52px] h-[78px] rounded bg-[#1e2530] flex items-center justify-center text-[#445566] text-lg">📖</div>
          )
        ) : (
          entry.coverUrl ? (
            <Image src={entry.coverUrl} alt={entry.title} width={52} height={78}
              className="rounded object-cover" />
          ) : (
            <div className="w-[52px] h-[78px] rounded bg-[#1e2530] flex items-center justify-center text-[#445566] text-lg">📺</div>
          )
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.badge} flex-shrink-0`}>
              {config.label}
            </span>
            <h3 className="font-semibold text-white truncate">
              {entry.type === "movie" ? (
                <a
                  href={entry.letterboxdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00e054] transition-colors"
                >
                  {entry.title}
                  {entry.filmYear && (
                    <span className="text-[#9ab] font-normal ml-1.5 text-sm">{entry.filmYear}</span>
                  )}
                </a>
              ) : (
                entry.title
              )}
            </h3>
          </div>
          <span className="text-xs text-[#9ab] flex-shrink-0">{formatDate(entry.date)}</span>
        </div>

        <div className="mt-1 text-sm text-[#9ab]">
          {entry.type === "book" && <span>{entry.author}{entry.genre && ` · ${entry.genre}`}</span>}
          {entry.type === "tv" && entry.season && <span>Season {entry.season}{entry.network && ` · ${entry.network}`}</span>}
        </div>

        {entry.rating !== undefined && (
          <div className="mt-1.5">
            <StarRating value={entry.rating} size="sm" />
          </div>
        )}

        {entry.notes && (
          <blockquote className="mt-2 border-l-2 border-[#445566] pl-3 text-sm text-[#9ab] italic leading-relaxed">
            {entry.notes}
          </blockquote>
        )}
      </div>
    </div>
  );
}
