import { supabase } from "@/lib/supabase";
import {
    IncomingsExpensesTransaction,
    IncomingsExpensesTransactionResponse,
} from "@/types/list.types";
import * as Crypto from "expo-crypto";

const PAGE_SIZE = 2;

export async function getIncomingsExpensesTransactions(
  page: number,
  userId: string,
): Promise<IncomingsExpensesTransactionResponse> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("incomings_expenses_transactions_grouped")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .range(from, to);

  if (error) throw error;

  const result: IncomingsExpensesTransaction[] = (data ?? [])
    .filter((item) => item.reference !== null)
    .map((item) => ({
      reference: item.reference!,
      incoming_value: item.incoming_value ?? 0,
      expense_value: item.expense_value ?? 0,
      net_income: item.net_income ?? 0,
      id: Crypto.randomUUID(),
    }));

  return { data: result, totalElements: count ?? 0 };
}
