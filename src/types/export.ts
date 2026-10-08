export interface GroupedTransaction {
  reference: string;
  currency: string;
  incoming_value: number;
  expense_value: number;
  net_income: number;
}

export interface DetailedTransaction {
  reference: string;
  currency: string;
  description: string;
  value: number;
  type: "incoming" | "expense";
}
