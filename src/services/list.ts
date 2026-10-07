import {
  getDistinctReferences as getDistinctReferencesQuery,
  getGroupedTransactionsByReferences,
} from "@/db/seeds/queries/list";

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
  return getDistinctReferencesQuery(page, userId, pageSize);
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
  const rows = getGroupedTransactionsByReferences(userId, references);
  return rows.map((row) => ({
    id: `${row.reference}-${row.currency}`,
    reference: row.reference,
    currency: row.currency,
    incoming_value: row.incoming_value,
    expense_value: row.expense_value,
    net_income: row.net_income,
  }));
}
