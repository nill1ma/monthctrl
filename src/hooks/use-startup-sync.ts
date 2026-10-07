import { useRouter } from "expo-router";
import { useEffect } from "react";

import { useAuth } from "@/context/auth";
import { setMeta } from "@/db/seeds/queries/meta";
import { isRemoteBackupNewer } from "@/lib/backup/check-remote";
import { queryClient } from "@/lib/query-client";
import { restoreFromCloud } from "@/services/backup";

let syncPromise: Promise<void> | null = null;

export function useStartupSync() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!session) return;
    if (syncPromise) return;

    syncPromise = (async () => {
      try {
        const userId = session!.user.id;
        console.log("startup sync: starting for", userId);

        const { newer, remoteTimestamp } = await isRemoteBackupNewer(userId);
        console.log("startup sync: newer =", newer);

        if (!newer) return;

        console.log("startup sync: restoring...");
        await restoreFromCloud(userId);
        console.log("startup sync: restore complete");

        setMeta("last_synced_at", remoteTimestamp!);
        await queryClient.resetQueries();
        router.replace("/");
        console.log("startup sync: navigated");
      } catch (error) {
        console.warn("Startup sync failed:", error);
        syncPromise = null;
      }
    })();
  }, [session, loading]);
}
