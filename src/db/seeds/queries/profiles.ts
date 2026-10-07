import { getDatabase } from "@/db/client";

export type LocalProfile = {
  user_id: string;
  name: string | null;
  nickname: string | null;
  preferred_currency: string | null;
  updated_at: string;
};

export function getProfile(userId: string): LocalProfile | null {
  const db = getDatabase();
  return (
    db.getFirstSync<LocalProfile>(`SELECT * FROM profiles WHERE user_id = ?`, [
      userId,
    ]) ?? null
  );
}

export function upsertProfile(
  userId: string,
  input: { name?: string; nickname?: string; preferred_currency?: string },
): LocalProfile {
  const db = getDatabase();
  const now = new Date().toISOString();

  db.runSync(
    `INSERT INTO profiles (user_id, name, nickname, preferred_currency, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       name = excluded.name,
       nickname = excluded.nickname,
       preferred_currency = excluded.preferred_currency,
       updated_at = excluded.updated_at`,
    [
      userId,
      input.name ?? null,
      input.nickname ?? null,
      input.preferred_currency ?? null,
      now,
    ],
  );

  return getProfile(userId)!;
}
