import { getDatabase } from "@/db/client";
import * as Crypto from "expo-crypto";
import type { LocalExpense } from "./types";

type ExpenseInput = {
  user_id: string;
  reference: string;
  value: number | null;
  destination: string;
  currency: string;
  category_id: string | null;
  due_date: string | null;
  payment_day: string | null;
};

export function createExpense(input: ExpenseInput): LocalExpense {
  const db = getDatabase();
  const id = Crypto.randomUUID();
  const now = new Date().toISOString();

  db.runSync(
    `INSERT INTO expenses
      (id, user_id, reference, value, destination, currency, category_id, due_date, payment_day, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.user_id,
      input.reference,
      input.value,
      input.destination,
      input.currency,
      input.category_id,
      input.due_date,
      input.payment_day,
      now,
      now,
    ],
  );

  return getExpenseById(id)!;
}

export function updateExpense(
  id: string,
  input: Partial<ExpenseInput>,
): LocalExpense | null {
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

  db.runSync(`UPDATE expenses SET ${fields.join(", ")} WHERE id = ?`, values);

  return getExpenseById(id);
}

export function deleteExpense(id: string): void {
  const db = getDatabase();
  const now = new Date().toISOString();

  db.runSync(
    `UPDATE expenses SET deleted_at = ?, updated_at = ? WHERE id = ?`,
    [now, now, id],
  );
}

export function getExpenseById(id: string): LocalExpense | null {
  const db = getDatabase();
  return (
    db.getFirstSync<LocalExpense>(
      `SELECT * FROM expenses WHERE id = ? AND deleted_at IS NULL`,
      [id],
    ) ?? null
  );
}

export function getExpenses(userId: string): LocalExpense[] {
  const db = getDatabase();
  return db.getAllSync<LocalExpense>(
    `SELECT * FROM expenses
     WHERE user_id = ? AND deleted_at IS NULL
     ORDER BY reference DESC, created_at DESC`,
    [userId],
  );
}
