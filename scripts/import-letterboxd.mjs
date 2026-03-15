#!/usr/bin/env node
/**
 * One-time import script for Letterboxd data export.
 * Usage: node scripts/import-letterboxd.mjs <path-to-zip>
 *
 * Reads diary.csv + reviews.csv from the export zip, merges with
 * existing data/movies.json (preserving poster URLs), and writes
 * the full history back.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const moviesPath = path.join(dataDir, "movies.json");

const zipPath = process.argv[2];
if (!zipPath) {
  console.error("Usage: node scripts/import-letterboxd.mjs <path-to-zip>");
  process.exit(1);
}

// --- CSV parser (no deps) ---
function parseCsv(raw) {
  const lines = raw.trim().split("\n");
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

function splitCsvLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

// --- Read files from zip ---
function readFromZip(zipFile, filename) {
  try {
    return execSync(`unzip -p "${zipFile}" "${filename}"`, { encoding: "utf-8" });
  } catch {
    return null;
  }
}

// --- Load existing movies.json ---
fs.mkdirSync(dataDir, { recursive: true });
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(moviesPath, "utf-8"));
} catch {}

// Index existing by letterboxdUrl for de-duplication
const byUrl = new Map(existing.map((m) => [m.letterboxdUrl, m]));

// --- Parse diary + reviews ---
const diaryRaw = readFromZip(zipPath, "diary.csv");
const reviewsRaw = readFromZip(zipPath, "reviews.csv");

if (!diaryRaw) {
  console.error("Could not read diary.csv from zip");
  process.exit(1);
}

const diary = parseCsv(diaryRaw);
const reviewMap = new Map();
if (reviewsRaw) {
  for (const row of parseCsv(reviewsRaw)) {
    if (row["Letterboxd URI"] && row["Review"]) {
      reviewMap.set(row["Letterboxd URI"], row["Review"].trim());
    }
  }
}

// --- Merge CSV entries ---
let added = 0;
for (const row of diary) {
  const url = row["Letterboxd URI"];
  if (!url) continue;

  if (byUrl.has(url)) {
    // Entry exists (from RSS) — patch in review if missing
    const entry = byUrl.get(url);
    if (!entry.notes && reviewMap.has(url)) {
      entry.notes = reviewMap.get(url);
    }
    continue;
  }

  const watchedDate = row["Watched Date"] || row["Date"] || "";
  const rating = row["Rating"] ? parseFloat(row["Rating"]) : undefined;
  const year = row["Year"] ? parseInt(row["Year"]) : undefined;
  const notes = reviewMap.get(url) || undefined;

  byUrl.set(url, {
    id: url,
    type: "movie",
    title: row["Name"],
    date: watchedDate,
    rating,
    notes,
    letterboxdUrl: url,
    posterUrl: undefined, // RSS accumulation will fill these over time
    filmYear: year,
  });
  added++;
}

// --- Sort and write ---
const merged = Array.from(byUrl.values()).sort((a, b) =>
  b.date.localeCompare(a.date)
);

const tmpPath = moviesPath + ".tmp";
fs.writeFileSync(tmpPath, JSON.stringify(merged, null, 2), "utf-8");
fs.renameSync(tmpPath, moviesPath);

console.log(`Done. Added ${added} new entries. Total: ${merged.length} movies.`);
