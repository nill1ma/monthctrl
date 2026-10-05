import * as SQLite from "expo-sqlite";
import { migrations } from "./migrations";

const DB_NAME = "monthctrl.db";

let db: SQLite.SQLiteDatabase | null = null;

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync(DB_NAME);
  }
  return db;
}

export function initializeDatabase(): void {
  const database = getDatabase();

  const result = database.getFirstSync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  const currentVersion = result?.user_version ?? 0;

  for (let i = currentVersion; i < migrations.length; i++) {
    const migration = migrations[i];
    database.withTransactionSync(() => {
      migration.up(database);
      database.execSync(`PRAGMA user_version = ${migration.version}`);
    });
  }
}
