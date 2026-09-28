type UUID = string;

export interface IncomingsExpensesTransaction {
  id: UUID;
  reference: string;
  incoming_value: number;
  expense_value: number;
  net_income: number;
}
export type IncomingsExpensesTransactionResponse = {
  data: IncomingsExpensesTransaction[];
  totalElements: number;
};
