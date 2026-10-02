import { convertToDisplayCurrency } from "@/lib/currency";
import { IncomingsExpensesTransaction } from "@/types/list.types";

export type ReferenceGroup = {
  reference: string;
  currencies: Pick<
    IncomingsExpensesTransaction,
    "currency" | "incoming_value" | "expense_value" | "net_income"
  >[];
};

export function groupTransactionsByReference(
  rows: IncomingsExpensesTransaction[],
): ReferenceGroup[] {
  const map = new Map<string, ReferenceGroup["currencies"]>();

  for (const row of rows) {
    const existing = map.get(row.reference) ?? [];
    existing.push({
      currency: row.currency,
      incoming_value: row.incoming_value,
      expense_value: row.expense_value,
      net_income: row.net_income,
    });
    map.set(row.reference, existing);
  }

  return Array.from(map.entries()).map(([reference, currencies]) => ({
    reference,
    currencies,
  }));
}

export function getConvertedBalance(
  group: ReferenceGroup,
  displayCurrency: string,
  rates: Record<string, number>,
): { incoming: number; expense: number; net: number } | null {
  let incoming = 0;
  let expense = 0;

  for (const entry of group.currencies) {
    const incomingConverted = convertToDisplayCurrency(
      entry.incoming_value,
      entry.currency,
      displayCurrency,
      rates,
    );
    const expenseConverted = convertToDisplayCurrency(
      entry.expense_value,
      entry.currency,
      displayCurrency,
      rates,
    );

    if (incomingConverted === null || expenseConverted === null) return null;

    incoming += incomingConverted;
    expense += expenseConverted;
  }

  return { incoming, expense, net: incoming - expense };
}
