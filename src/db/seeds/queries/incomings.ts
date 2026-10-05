import { getDatabase } from "@/db/client";
import type { LocalIncoming } from "@/db/seeds/queries/types";
import * as Crypto from "expo-crypto";

type IncomingInput = {
  user_id: string;
  reference: string;
  value: number | null;
  origin: string;
  currency: string;
  category_id: string | null;
};

export function createIncoming(input: IncomingInput): LocalIncoming {
  const db = getDatabase();
  const id = Crypto.randomUUID();
  const now = new Date().toISOString();

  db.runSync(
    `INSERT INTO incomings
      (id, user_id, reference, value, origin, currency, category_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.user_id,
      input.reference,
      input.value,
      input.origin,
      input.currency,
      input.category_id,
      now,
      now,
    ],
  );

  return getIncomingById(id)!;
}

export function updateIncoming(
  id: string,
  input: Partial<IncomingInput>,
): LocalIncoming | null {
  const db = getDatabase();
  const now = new Date().toISOString();

  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  for (const [key, value] of Object.entries(input)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  fields.push("updated_at = ?");
  values.push(now);
  values.push(id);

  db.runSync(`UPDATE incomings SET ${fields.join(", ")} WHERE id = ?`, values);

  return getIncomingById(id);
}

export function deleteIncoming(id: string): void {
  const db = getDatabase();
  const now = new Date().toISOString();

  // Soft delete: marca como deletado sem remover
  db.runSync(
    `UPDATE incomings SET deleted_at = ?, updated_at = ? WHERE id = ?`,
    [now, now, id],
  );
}

export function getIncomingById(id: string): LocalIncoming | null {
  const db = getDatabase();
  return (
    db.getFirstSync<LocalIncoming>(
      `SELECT * FROM incomings WHERE id = ? AND deleted_at IS NULL`,
      [id],
    ) ?? null
  );
}

export function getIncomings(userId: string): LocalIncoming[] {
  const db = getDatabase();
  return db.getAllSync<LocalIncoming>(
    `SELECT * FROM incomings
     WHERE user_id = ? AND deleted_at IS NULL
     ORDER BY reference DESC, created_at DESC`,
    [userId],
  );
}
