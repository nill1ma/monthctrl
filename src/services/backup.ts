import {
  downloadBackup,
  hasRemoteBackup,
  restoreSnapshotToLocal,
} from "@/lib/backup/restore";
import { setRestoring } from "@/lib/backup/sync-manager";
import { uploadBackup } from "@/lib/backup/upload";
import { getAuthenticatedUserId } from "@/lib/supabase";

export async function backupNow(): Promise<void> {
  const userId = await getAuthenticatedUserId();
  await uploadBackup(userId);
}

export async function checkRemoteBackupExists(): Promise<boolean> {
  const userId = await getAuthenticatedUserId();
  return hasRemoteBackup(userId);
}

export async function restoreFromCloud(userId: string): Promise<void> {
  // const userId = await getAuthenticatedUserId();
  setRestoring(true);
  try {
    const snapshot = await downloadBackup(userId);
    restoreSnapshotToLocal(snapshot);
  } finally {
    setRestoring(false);
  }
}
