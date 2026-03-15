import { readData } from "@/lib/db";
import type { TvEntry } from "@/lib/types";
import FeedItem from "@/components/FeedItem";
import TvForm from "@/components/TvForm";

export default function TvPage() {
  const shows = readData<TvEntry>("tv").sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">TV Shows</h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-3">
          {shows.length === 0 ? (
            <div className="text-center py-16 text-[#9ab]">
              <p className="text-4xl mb-3">📺</p>
              <p className="text-sm">No TV shows logged yet. Add your first one!</p>
            </div>
          ) : (
            shows.map((show) => <FeedItem key={show.id} entry={show} />)
          )}
        </div>
        <div className="md:sticky md:top-6">
          <TvForm />
        </div>
      </div>
    </div>
  );
}
