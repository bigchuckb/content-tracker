import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

function ensureDataDir() {
  fs.mkdirSync(dataDir, { recursive: true });
}

export function readData<T>(filename: "books" | "tv" | "movies"): T[] {
  ensureDataDir();
  const filePath = path.join(dataDir, `${filename}.json`);
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export function writeData<T>(filename: "books" | "tv" | "movies", data: T[]): void {
  ensureDataDir();
  const filePath = path.join(dataDir, `${filename}.json`);
  const tmpPath = path.join(dataDir, `${filename}.tmp.json`);
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmpPath, filePath);
}
