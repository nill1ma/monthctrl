import { getDatabase } from "@/db/client";
import type { CurrencyTotal } from "./types";

export function getCurrencyTotals(userId: string): CurrencyTotal[] {
  const db = getDatabase();

  return db.getAllSync<CurrencyTotal>(
    `
    SELECT
      currency,
      SUM(CASE WHEN type = 'incoming' THEN value ELSE 0 END) AS incoming_value,
      SUM(CASE WHEN type = 'expense'  THEN value ELSE 0 END) AS expense_value,
      SUM(CASE WHEN type = 'incoming' THEN value ELSE -value END) AS net_income
    FROM (
      SELECT value, currency, 'incoming' AS type
      FROM incomings
      WHERE user_id = ? AND deleted_at IS NULL

      UNION ALL

      SELECT value, currency, 'expense' AS type
      FROM expenses
      WHERE user_id = ? AND deleted_at IS NULL
    )
    GROUP BY currency
    ORDER BY currency ASC
    `,
    [userId, userId],
  );
}
