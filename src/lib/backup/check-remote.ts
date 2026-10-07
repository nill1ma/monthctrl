import { getMeta } from "@/db/seeds/queries/meta";
import { supabase } from "@/lib/supabase";

export async function isRemoteBackupNewer(
  userId: string,
): Promise<{ newer: boolean; remoteTimestamp: string | null }> {
  const lastSyncedAt = getMeta("last_synced_at");

  const { data, error } = await supabase.storage
    .from("backups")
    .list(userId, { search: "latest.json.gz" });

  if (error || !data?.[0]) return { newer: false, remoteTimestamp: null };

  const remoteTimestamp = data[0].updated_at ?? data[0].created_at ?? null;

  console.log("check-remote: lastSyncedAt =", lastSyncedAt);
  console.log("check-remote: remoteTimestamp =", remoteTimestamp);
  console.log(
    "check-remote: result =",
    !lastSyncedAt || remoteTimestamp! > lastSyncedAt,
  );

  if (!remoteTimestamp) return { newer: false, remoteTimestamp: null };

  const newer = !lastSyncedAt || remoteTimestamp > lastSyncedAt;

  return { newer, remoteTimestamp };
}
