export type ContentType = "movie" | "book" | "tv";

interface BaseEntry {
  id: string;
  type: ContentType;
  title: string;
  date: string; // YYYY-MM-DD
  rating?: number; // 0–5, 0.5 increments
  notes?: string;
}

export interface MovieEntry extends BaseEntry {
  type: "movie";
  letterboxdUrl: string;
  posterUrl?: string;
  filmYear?: number;
}

export interface BookEntry extends BaseEntry {
  type: "book";
  author: string;
  genre?: string;
  coverUrl?: string;
}

export interface TvEntry extends BaseEntry {
  type: "tv";
  season?: number;
  network?: string;
  coverUrl?: string;
}

export type FeedEntry = MovieEntry | BookEntry | TvEntry;
