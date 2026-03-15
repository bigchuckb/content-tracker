import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { BookEntry } from "@/lib/types";

async function fetchBookCover(title: string, author: string): Promise<string | undefined> {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    const res = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=1&fields=cover_i`);
    const data = await res.json();
    const coverId = data?.docs?.[0]?.cover_i;
    if (coverId) return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  } catch {}
  return undefined;
}

export async function GET() {
  const books = readData<BookEntry>("books");
  const sorted = books.sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json(sorted);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, author, date, rating, notes, genre } = body;

  if (!title || !author || !date) {
    return NextResponse.json({ error: "title, author, and date are required" }, { status: 400 });
  }

  const coverUrl = await fetchBookCover(title, author);

  const newEntry: BookEntry = {
    id: crypto.randomUUID(),
    type: "book",
    title,
    author,
    date,
    rating: rating !== undefined ? parseFloat(rating) : undefined,
    notes: notes || undefined,
    genre: genre || undefined,
    coverUrl,
  };

  const books = readData<BookEntry>("books");
  books.push(newEntry);
  writeData("books", books);

  return NextResponse.json(newEntry, { status: 201 });
}
