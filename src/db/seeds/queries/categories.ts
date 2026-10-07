import { getDatabase } from "@/db/client";
import type { LocalCategory } from "@/db/seeds/queries/types";

export function getCategoriesByType(
  type: "incoming" | "expense",
): LocalCategory[] {
  const db = getDatabase();
  return db.getAllSync<LocalCategory>(
    `SELECT * FROM categories WHERE type = ? AND user_id IS NULL ORDER BY name`,
    [type],
  );
}
