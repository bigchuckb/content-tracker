"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";

const inputCls = "w-full bg-[#14181c] border border-[#445566] rounded px-3 py-2 text-sm text-white placeholder-[#9ab] focus:outline-none focus:border-[#00e054] transition-colors";
const labelCls = "block text-xs font-medium text-[#9ab] mb-1 uppercase tracking-wide";

export default function BookForm() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(today);
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author, date, rating: rating || undefined, notes: notes || undefined, genre: genre || undefined }),
    });
    setTitle(""); setAuthor(""); setDate(today); setRating(0); setNotes(""); setGenre("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#2c3440] rounded border border-[#445566] p-5 space-y-4">
      <h2 className="font-semibold text-white text-sm uppercase tracking-wide">Add a Book</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={labelCls}>Title *</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Author *</label>
          <input required value={author} onChange={(e) => setAuthor(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Date Read *</label>
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Genre</label>
          <input value={genre} onChange={(e) => setGenre(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Rating</label>
        <StarRating value={rating} interactive onChange={setRating} />
      </div>

      <div>
        <label className={labelCls}>Review</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="What did you think?" className={`${inputCls} resize-none`} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#00e054] text-[#14181c] rounded px-4 py-2 text-sm font-bold hover:bg-[#00c44a] disabled:opacity-50 transition-colors uppercase tracking-wide"
      >
        {loading ? "Adding..." : "Add Book"}
      </button>
    </form>
  );
}
