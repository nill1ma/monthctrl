import { getCurrencyTotals as getCurrencyTotalsQuery } from "@/db/seeds/queries/currency-totals";

export type CurrencyTotal = {
  currency: string;
  incoming_value: number;
  expense_value: number;
  net_income: number;
};

export async function getCurrencyTotals(
  userId: string,
): Promise<CurrencyTotal[]> {
  return getCurrencyTotalsQuery(userId);
}
