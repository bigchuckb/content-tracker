"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TYPES = [
  { value: "", label: "All" },
  { value: "movie", label: "Films" },
  { value: "book", label: "Books" },
  { value: "tv", label: "TV" },
];

const MIN_RATINGS = [
  { value: "", label: "Any rating" },
  { value: "1", label: "1+ ★" },
  { value: "2", label: "2+ ★" },
  { value: "3", label: "3+ ★" },
  { value: "4", label: "4+ ★" },
  { value: "4.5", label: "4.5+ ★" },
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") ?? "";
  const activeMinRating = searchParams.get("minRating") ?? "";

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-[#445566] pb-3 mb-4">
      <div className="flex items-center gap-1">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => update("type", t.value)}
            className={`px-3 py-1 text-sm font-medium transition-colors rounded ${
              activeType === t.value
                ? "text-[#00e054] border-b-2 border-[#00e054]"
                : "text-[#9ab] hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <select
        value={activeMinRating}
        onChange={(e) => update("minRating", e.target.value)}
        className="ml-auto text-sm border border-[#445566] rounded px-3 py-1 bg-[#2c3440] text-[#9ab] cursor-pointer focus:outline-none focus:border-[#00e054]"
      >
        {MIN_RATINGS.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
