import {
  createExpense as createExpenseQuery,
  deleteExpense as deleteExpenseQuery,
  deleteExpensesByReference as deleteExpensesByReferenceQuery,
  getExpenseById as getExpenseByIdQuery,
  getExpensesByReference,
  getExpenses as getExpensesQuery,
  updateExpense as updateExpenseQuery,
} from "@/db/seeds/queries/expenses";
import { getAuthenticatedUserId } from "@/lib/supabase";
import { CreateExpense, UpdateExpense } from "@/types/expenses.types";

export async function getExpenses() {
  const userId = await getAuthenticatedUserId();
  return getExpensesQuery(userId);
}

export async function getExpenseByReference(reference: string) {
  const userId = await getAuthenticatedUserId();
  return getExpensesByReference(userId, reference);
}

export async function getExpenseById(id: string) {
  return getExpenseByIdQuery(id);
}

export async function createExpense(formData: CreateExpense) {
  const userId = await getAuthenticatedUserId();
  return createExpenseQuery({ ...formData, user_id: userId });
}

export async function updateExpense(formData: UpdateExpense) {
  const { id, ...rest } = formData;
  return updateExpenseQuery(id, rest);
}

export async function deleteExpense(expense_id: string) {
  deleteExpenseQuery(expense_id);
}
export async function deleteExpensesByReference(reference: string) {
  const userId = await getAuthenticatedUserId();
  deleteExpensesByReferenceQuery(userId, reference);
}
