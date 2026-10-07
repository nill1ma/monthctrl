import { getProfile, upsertProfile } from "@/db/seeds/queries/profiles";
import { getAuthenticatedUserId } from "@/lib/supabase";

export async function getMyProfile() {
  const userId = await getAuthenticatedUserId();
  return getProfile(userId);
}

export async function updateMyProfile(input: {
  name?: string;
  nickname?: string;
  preferred_currency?: string;
}) {
  const userId = await getAuthenticatedUserId();
  return upsertProfile(userId, input);
}
