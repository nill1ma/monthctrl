import { getDatabase } from "@/db/client";
import type { GroupedTransaction } from "./types";

/**
 * Equivalente à view `incomings_expenses_transactions_grouped`:
 * uma linha por (reference, currency) com somas.
 */
export function getGroupedTransactions(userId: string): GroupedTransaction[] {
  const db = getDatabase();

  return db.getAllSync<GroupedTransaction>(
    `
    SELECT
      reference,
      currency,
      SUM(CASE WHEN type = 'incoming' THEN value ELSE 0 END) AS incoming_value,
      SUM(CASE WHEN type = 'expense'  THEN value ELSE 0 END) AS expense_value,
      SUM(CASE WHEN type = 'incoming' THEN value ELSE -value END) AS net_income
    FROM (
      SELECT reference, value, currency, 'incoming' AS type
      FROM incomings
      WHERE user_id = ? AND deleted_at IS NULL

      UNION ALL

      SELECT reference, value, currency, 'expense' AS type
      FROM expenses
      WHERE user_id = ? AND deleted_at IS NULL
    )
    WHERE reference IS NOT NULL
    GROUP BY reference, currency
    ORDER BY reference DESC, currency ASC
    `,
    [userId, userId],
  );
}

/**
 * Equivalente à RPC `get_distinct_references`.
 * Retorna as references distintas da página, com o total geral.
 */
export function getDistinctReferences(
  page: number,
  userId: string,
  pageSize: number,
): { references: string[]; totalElements: number } {
  const db = getDatabase();
  const offset = (page - 1) * pageSize;

  // Total geral
  const totalRow = db.getFirstSync<{ total: number }>(
    `
    SELECT COUNT(DISTINCT reference) AS total
    FROM (
      SELECT reference FROM incomings
        WHERE user_id = ? AND deleted_at IS NULL AND reference IS NOT NULL
      UNION
      SELECT reference FROM expenses
        WHERE user_id = ? AND deleted_at IS NULL AND reference IS NOT NULL
    )
    `,
    [userId, userId],
  );
  const totalElements = totalRow?.total ?? 0;

  // Página atual
  const rows = db.getAllSync<{ reference: string }>(
    `
    SELECT DISTINCT reference
    FROM (
      SELECT reference FROM incomings
        WHERE user_id = ? AND deleted_at IS NULL AND reference IS NOT NULL
      UNION
      SELECT reference FROM expenses
        WHERE user_id = ? AND deleted_at IS NULL AND reference IS NOT NULL
    )
    ORDER BY reference DESC
    LIMIT ? OFFSET ?
    `,
    [userId, userId, pageSize, offset],
  );

  return {
    references: rows.map((r) => r.reference),
    totalElements,
  };
}

/**
 * Todas as linhas da view `incomings_expenses_transactions`
 * para um conjunto de references — usado pela tela de detalhes.
 */
export function getTransactionsByReferences(
  references: string[],
  userId: string,
): {
  id: string;
  reference: string;
  type: "incoming" | "expense";
  value: number | null;
  currency: string;
  category_id: string | null;
}[] {
  if (references.length === 0) return [];

  const db = getDatabase();
  const placeholders = references.map(() => "?").join(", ");

  return db.getAllSync(
    `
    SELECT id, reference, 'incoming' AS type, value, currency, category_id
    FROM incomings
    WHERE user_id = ? AND deleted_at IS NULL AND reference IN (${placeholders})

    UNION ALL

    SELECT id, reference, 'expense' AS type, value, currency, category_id
    FROM expenses
    WHERE user_id = ? AND deleted_at IS NULL AND reference IN (${placeholders})
    `,
    [userId, ...references, userId, ...references],
  ) as ReturnType<typeof getTransactionsByReferences>;
}
