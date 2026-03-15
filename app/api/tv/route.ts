import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { TvEntry } from "@/lib/types";

async function fetchTvCover(title: string): Promise<string | undefined> {
  try {
    const res = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(title)}`);
    const data = await res.json();
    return data?.image?.medium ?? data?.image?.original ?? undefined;
  } catch {}
  return undefined;
}

export async function GET() {
  const shows = readData<TvEntry>("tv");
  const sorted = shows.sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json(sorted);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, season, date, rating, notes, network } = body;

  if (!title || !date) {
    return NextResponse.json({ error: "title and date are required" }, { status: 400 });
  }

  const coverUrl = await fetchTvCover(title);

  const newEntry: TvEntry = {
    id: crypto.randomUUID(),
    type: "tv",
    title,
    season: season !== undefined && season !== "" ? parseInt(season) : undefined,
    date,
    rating: rating !== undefined ? parseFloat(rating) : undefined,
    notes: notes || undefined,
    network: network || undefined,
    coverUrl,
  };

  const shows = readData<TvEntry>("tv");
  shows.push(newEntry);
  writeData("tv", shows);

  return NextResponse.json(newEntry, { status: 201 });
}
