import { TransactionRow } from "@/services/list";

export type GroupedTransaction = {
  reference: string;
  incoming_value: number;
  expense_value: number;
  net_income: number;
  currencies: string[];
};

export function groupByReference(rows: TransactionRow[]): GroupedTransaction[] {
  const map = new Map<string, GroupedTransaction>();

  for (const row of rows) {
    const existing = map.get(row.reference);
    if (existing) {
      existing.incoming_value += row.incoming_value;
      existing.expense_value += row.expense_value;
      existing.net_income += row.net_income;
      if (!existing.currencies.includes(row.currency)) {
        existing.currencies.push(row.currency);
      }
    } else {
      map.set(row.reference, {
        reference: row.reference,
        incoming_value: row.incoming_value,
        expense_value: row.expense_value,
        net_income: row.net_income,
        currencies: [row.currency],
      });
    }
  }

  return Array.from(map.values());
}
