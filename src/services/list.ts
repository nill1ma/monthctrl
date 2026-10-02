import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 5;

type DistinctReferencesResponse = {
  references: string[];
  totalElements: number;
};

export async function getDistinctReferences(
  page: number,
  userId: string,
  pageSize: number = PAGE_SIZE,
): Promise<DistinctReferencesResponse> {
  const offset = (page - 1) * pageSize;

  const { data, error } = await supabase.rpc("get_distinct_references", {
    p_user_id: userId,
    p_limit: pageSize,
    p_offset: offset,
  });

  if (error) throw error;

  const totalElements = Number(data?.[0]?.total_count ?? 0);
  const references = (data ?? [])
    .map((item) => item.reference)
    .filter((ref): ref is string => ref !== null);

  return { references, totalElements };
}

export type TransactionRow = {
  id: string;
  reference: string;
  currency: string;
  incoming_value: number;
  expense_value: number;
  net_income: number;
};

export async function getTransactionsByReferences(
  references: string[],
  userId: string,
): Promise<TransactionRow[]> {
  if (references.length === 0) return [];

  const { data, error } = await supabase
    .from("incomings_expenses_transactions_grouped")
    .select("*")
    .eq("user_id", userId)
    .in("reference", references);

  if (error) throw error;

  return (data ?? []).map((item) => ({
    id: `${item.reference}-${item.currency}`,
    reference: item.reference!,
    currency: item.currency!,
    incoming_value: Number(item.incoming_value ?? 0),
    expense_value: Number(item.expense_value ?? 0),
    net_income: Number(item.net_income ?? 0),
  }));
}
