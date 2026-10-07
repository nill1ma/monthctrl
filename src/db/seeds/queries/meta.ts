import { getDatabase } from "@/db/client";

export function getMeta(key: string): string | null {
  const db = getDatabase();
  const row = db.getFirstSync<{ value: string }>(
    `SELECT value FROM app_meta WHERE key = ?`,
    [key],
  );
  return row?.value ?? null;
}

export function setMeta(key: string, value: string | null): void {
  const db = getDatabase();
  db.runSync(
    `INSERT INTO app_meta (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [key, value],
  );
}

export function localHasAnyData(): boolean {
  const db = getDatabase();
  const row = db.getFirstSync<{ count: number }>(
    `SELECT
      (SELECT COUNT(*) FROM incomings WHERE deleted_at IS NULL) +
      (SELECT COUNT(*) FROM expenses WHERE deleted_at IS NULL) AS count`,
  );
  return (row?.count ?? 0) > 0;
}
