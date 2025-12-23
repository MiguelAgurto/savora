import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const dbPath = path.join(dataDir, "savora.sqlite");
export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

// Create tables if not exists
db.exec(`
CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  ingredients_json TEXT NOT NULL,
  steps_json TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  raw_text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);
