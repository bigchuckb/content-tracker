import Image from "next/image";
import { fetchLetterboxd } from "@/lib/rss";
import StarRating from "@/components/StarRating";

export const revalidate = 1800;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function MoviesPage() {
  const movies = await fetchLetterboxd();

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-6">
        <h1 className="text-2xl font-bold text-white">Films</h1>
        <span className="text-sm text-[#9ab]">{movies.length} logged</span>
      </div>

      <div className="divide-y divide-[#456]">
        {movies.map((movie) => (
          <div key={movie.id} className="flex gap-4 py-4">
            {/* Poster */}
            <div className="flex-shrink-0">
              {movie.posterUrl ? (
                <a href={movie.letterboxdUrl} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    width={60}
                    height={90}
                    className="rounded object-cover hover:opacity-80 transition-opacity"
                  />
                </a>
              ) : (
                <div className="w-[60px] h-[90px] rounded bg-[#2c3440] flex items-center justify-center text-[#456]">
                  🎬
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 py-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <a
                    href={movie.letterboxdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white hover:text-[#00e054] transition-colors"
                  >
                    {movie.title}
                  </a>
                  {movie.filmYear && (
                    <span className="ml-2 text-sm text-[#9ab]">{movie.filmYear}</span>
                  )}
                </div>
                <span className="text-xs text-[#9ab] flex-shrink-0">{formatDate(movie.date)}</span>
              </div>

              {movie.rating !== undefined && (
                <div className="mt-1.5">
                  <StarRating value={movie.rating} size="sm" />
                </div>
              )}

              {movie.notes && (
                <blockquote className="mt-2 border-l-2 border-[#445566] pl-3 text-sm text-[#9ab] italic leading-relaxed">
                  {movie.notes}
                </blockquote>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
