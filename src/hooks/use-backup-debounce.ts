// src/hooks/use-backup-debounce.ts
import {
  getIsRestoring,
  registerDebounceCancel,
} from "@/lib/backup/sync-manager";
import { backupNow } from "@/services/backup";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import { useBackgroundBackup } from "./use-background-backup";

export function useBackupDebounce() {
  const debouncedBackup = useMemo(
    () =>
      debounce(() => {
        if (getIsRestoring()) return;
        backupNow();
      }, 5000),
    [],
  );

  useEffect(() => {
    registerDebounceCancel(() => debouncedBackup.cancel());
    return () => registerDebounceCancel(() => {});
  }, [debouncedBackup]);

  useBackgroundBackup(() => debouncedBackup.flush());

  return debouncedBackup;
}
