import type { SQLiteDatabase } from "expo-sqlite";

export type Migration = {
  version: number;
  up: (db: SQLiteDatabase) => void;
};

export const migrations: Migration[] = [
  {
    version: 1,
    up: (db) => {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('incoming', 'expense')),
          user_id TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS incomings (
          id TEXT PRIMARY KEY NOT NULL,
          user_id TEXT NOT NULL,
          reference TEXT NOT NULL,
          value REAL,
          origin TEXT NOT NULL,
          currency TEXT NOT NULL,
          category_id TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          deleted_at TEXT,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS expenses (
          id TEXT PRIMARY KEY NOT NULL,
          user_id TEXT NOT NULL,
          reference TEXT NOT NULL,
          value REAL,
          destination TEXT NOT NULL,
          currency TEXT NOT NULL,
          category_id TEXT,
          due_date TEXT,
          payment_day TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          deleted_at TEXT,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        );

        CREATE INDEX IF NOT EXISTS idx_incomings_user_reference
          ON incomings(user_id, reference, deleted_at);

        CREATE INDEX IF NOT EXISTS idx_expenses_user_reference
          ON expenses(user_id, reference, deleted_at);

        CREATE INDEX IF NOT EXISTS idx_categories_user_type
          ON categories(user_id, type);

        CREATE INDEX IF NOT EXISTS idx_incomings_updated
          ON incomings(updated_at);

        CREATE INDEX IF NOT EXISTS idx_expenses_updated
          ON expenses(updated_at);
      `);
    },
  },
];
