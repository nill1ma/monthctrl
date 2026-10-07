import {
  createIncoming as createIncomingQuery,
  deleteIncoming as deleteIncomingQuery,
  deleteIncomingsByReference as deleteIncomingsByReferenceQuery,
  getIncomingById,
  getIncomingsByReference,
  getIncomings as getIncomingsQuery,
  updateIncoming as updateIncomingQuery,
} from "@/db/seeds/queries/incomings";
import { getAuthenticatedUserId } from "@/lib/supabase";
import { CreateIncoming, UpdateIncoming } from "@/types/incomings.types";

export async function getIncomings() {
  const userId = await getAuthenticatedUserId();
  return getIncomingsQuery(userId);
}

export async function getIncomingsById(id: string) {
  return getIncomingById(id);
}

export async function getIncomingByReference(reference: string) {
  const userId = await getAuthenticatedUserId();
  return getIncomingsByReference(userId, reference);
}

export async function createIncoming(formData: CreateIncoming) {
  const userId = await getAuthenticatedUserId();
  return createIncomingQuery({ ...formData, user_id: userId });
}

export async function updateIncoming(formData: UpdateIncoming) {
  const { id, ...rest } = formData;
  return updateIncomingQuery(id, rest);
}

export async function deleteIncoming(incoming_id: string) {
  deleteIncomingQuery(incoming_id);
}

export async function deleteIncomingsByReference(reference: string) {
  const userId = await getAuthenticatedUserId();
  deleteIncomingsByReferenceQuery(userId, reference);
}
