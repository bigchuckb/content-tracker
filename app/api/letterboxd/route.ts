import { NextResponse } from "next/server";
import { fetchLetterboxd } from "@/lib/rss";

export const revalidate = 1800;

export async function GET() {
  const movies = await fetchLetterboxd();
  return NextResponse.json(movies);
}
