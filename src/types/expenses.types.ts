export interface Expense {
  id: string;
  destination: string;
  value: number;
  payment_day?: string | null;
  due_date?: string | null;
  user_id: string;
  reference: string;
  category_id: string | null;
  currency: string;
}
export type DetailsIncomingData = Pick<Expense, "id" | "value" | "destination">;
export type CreateExpense = Pick<
  Expense,
  "value" | "destination" | "reference" | "category_id" | "currency"
>;
export type UpdateExpense = Pick<
  Expense,
  "id" | "value" | "destination" | "reference" | "category_id" | "currency"
>;
