import { getAuthenticatedUserId, supabase } from "@/lib/supabase";
import {
  CreateIncoming,
  Incoming,
  UpdateIncoming,
} from "@/types/incomings.types";

export async function getIncomings() {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("incomings")
    .select("id, reference, value")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getIncomingsById(id: string) {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("incomings")
    .select("id, origin, value, reference")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function getIncomingByReference(
  reference: string,
): Promise<Pick<Incoming, "id" | "value" | "origin">[]> {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from("incomings")
    .select("id, value, origin")
    .eq("reference", reference)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data;
}

export async function createIncoming(formData: CreateIncoming) {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("incomings")
    .insert({
      ...formData,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateIncoming(formData: UpdateIncoming) {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("incomings")
    .update({
      origin: formData.origin,
      value: formData.value,
      reference: formData.reference,
      user_id: userId,
    })
    .eq("id", formData.id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteIncoming(incoming_id: string) {
  const { data, error } = await supabase
    .from("incomings")
    .delete()
    .eq("id", incoming_id);

  if (error) throw new Error(error.message);
  return data;
}
