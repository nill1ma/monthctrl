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

        const { newer, remoteTimestamp } = await isRemoteBackupNewer(userId);

        if (!newer) return;

        await restoreFromCloud(userId);

        setMeta("last_synced_at", remoteTimestamp!);
        await queryClient.resetQueries();
        router.replace("/");
      } catch (error) {
        syncPromise = null;
      }
    })();
  }, [session, loading]);
}
