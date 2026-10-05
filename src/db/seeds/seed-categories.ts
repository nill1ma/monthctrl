import type { SQLiteDatabase } from "expo-sqlite";
import { DEFAULT_CATEGORIES } from "./categories";

export function seedDefaultCategories(db: SQLiteDatabase): void {
  const statement = db.prepareSync(`
    INSERT OR IGNORE INTO categories (id, name, type, user_id)
    VALUES (?, ?, ?, NULL)
  `);

  try {
    for (const category of DEFAULT_CATEGORIES) {
      statement.executeSync([category.id, category.name, category.type]);
    }
  } finally {
    statement.finalizeSync();
  }
}
