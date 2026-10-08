import {
  getCurrenciesInRange as getCurrenciesInRangeQuery,
  getCurrencyTotals as getCurrencyTotalsQuery,
} from "@/db/seeds/queries/currency-totals";

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

export async function getCurrenciesInRange(
  userId: string,
  referenceStart: string,
  referenceEnd: string,
): Promise<string[]> {
  return getCurrenciesInRangeQuery(userId, referenceStart, referenceEnd);
}
