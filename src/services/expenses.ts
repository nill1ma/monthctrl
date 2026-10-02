import { getAuthenticatedUserId, supabase } from "@/lib/supabase";
import { CreateExpense, Expense, UpdateExpense } from "@/types/expenses.types";

export async function getExpenses() {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from("expenses")
    .select("id, reference, value")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getExpenseByReference(
  reference: string,
): Promise<
  Pick<Expense, "id" | "value" | "destination" | "currency" | "category_id">[]
> {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from("expenses")
    .select("id, value, destination, currency, category_id")
    .eq("reference", reference)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getExpenseById(id: string) {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from("expenses")
    .select("id, destination, value, reference, category_id, currency")
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createExpense(formData: CreateExpense) {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      ...formData,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateExpense(formData: UpdateExpense) {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("expenses")
    .update({
      destination: formData.destination,
      value: formData.value,
      reference: formData.reference,
      currency: formData.currency,
      category_id: formData.category_id,
      user_id: userId,
    })
    .eq("id", formData.id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteExpense(expense_id: string) {
  const { data, error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expense_id);

  if (error) throw new Error(error.message);
  return data;
}
