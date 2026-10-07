import type { Tables } from "@/types/supabase.types";

/**
 * Tipos locais = linha do Supabase + campos exclusivos do SQLite
 * (updated_at, deleted_at). Assim, o shape é compatível com o que
 * as telas já esperam, e o merge de backup tem os campos necessários.
 */

export type LocalCategory = Tables<"categories">;

export type LocalIncoming = Tables<"incomings"> & {
  updated_at: string;
  deleted_at: string | null;
};

export type LocalExpense = Tables<"expenses"> & {
  updated_at: string;
  deleted_at: string | null;
  created_at: string | null;
};

export type CurrencyTotal = {
  currency: string;
  incoming_value: number;
  expense_value: number;
  net_income: number;
};

export type GroupedTransaction = {
  reference: string;
  currency: string;
  incoming_value: number;
  expense_value: number;
  net_income: number;
};

export type ReferenceSummary = {
  reference: string;
  total_count: number;
};
