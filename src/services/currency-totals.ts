import { supabase } from "@/lib/supabase";

export type CurrencyTotal = {
  currency: string;
  incoming_value: number;
  expense_value: number;
  net_income: number;
};

export async function getCurrencyTotals(
  userId: string,
): Promise<CurrencyTotal[]> {
  const { data, error } = await supabase
    .from("currency_totals")
    .select("currency, incoming_value, expense_value, net_income")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    currency: row.currency!,
    incoming_value: Number(row.incoming_value ?? 0),
    expense_value: Number(row.expense_value ?? 0),
    net_income: Number(row.net_income ?? 0),
  }));
}
