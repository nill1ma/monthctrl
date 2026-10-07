import { getDatabase } from "@/db/client";
import type { LocalProfile } from "@/db/seeds/queries/profiles";
import type {
  LocalCategory,
  LocalExpense,
  LocalIncoming,
} from "@/db/seeds/queries/types";

export type BackupSnapshot = {
  version: 1;
  exportedAt: string;
  incomings: LocalIncoming[];
  expenses: LocalExpense[];
  categories: LocalCategory[];
  profile: LocalProfile | null;
};

export function exportAllLocalData(userId: string): BackupSnapshot {
  const db = getDatabase();

  const incomings = db.getAllSync<LocalIncoming>(
    `SELECT * FROM incomings WHERE user_id = ? AND deleted_at IS NULL`,
    [userId],
  );

  const expenses = db.getAllSync<LocalExpense>(
    `SELECT * FROM expenses WHERE user_id = ? AND deleted_at IS NULL`,
    [userId],
  );

  const categories = db.getAllSync<LocalCategory>(
    `SELECT * FROM categories WHERE user_id = ?`,
    [userId],
  );

  const profile =
    db.getFirstSync<LocalProfile>(`SELECT * FROM profiles WHERE user_id = ?`, [
      userId,
    ]) ?? null;

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    incomings,
    expenses,
    categories,
    profile,
  };
}
