import { getDatabase } from "@/db/client";
import type { BackupSnapshot } from "@/lib/backup/export";
import { supabase } from "@/lib/supabase";
import { ungzip } from "pako";

export async function hasRemoteBackup(userId: string): Promise<boolean> {
  const { data, error } = await supabase.storage
    .from("backups")
    .list(userId, { search: "latest.json.gz" });

  return !error && !!data && data.length > 0;
}

// export async function downloadBackup(userId: string): Promise<BackupSnapshot> {
//   const { data, error } = await supabase.storage
//     .from("backups")
//     .download(`${userId}/latest.json.gz`);

//   if (error || !data) throw new Error(error?.message ?? "Backup not found");

//   const bytes = new Uint8Array(await data.arrayBuffer());
//   // const json = ungzip(bytes, { to: "string" });
//   const json = new TextDecoder().decode(ungzip(bytes));

//   return JSON.parse(json) as BackupSnapshot;
// }
// src/lib/backup/restore.ts
export async function downloadBackup(userId: string): Promise<BackupSnapshot> {
  const { data, error } = await supabase.storage
    .from("backups")
    .download(`${userId}/latest.json.gz?t=${Date.now()}`); // cache-busting

  if (error || !data) throw new Error(error?.message ?? "Backup not found");

  const bytes = await blobToUint8Array(data);
  const json = new TextDecoder().decode(ungzip(bytes));

  return JSON.parse(json) as BackupSnapshot;
}

function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(buffer));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

export function restoreSnapshotToLocal(snapshot: BackupSnapshot): void {
  const db = getDatabase();

  db.withTransactionSync(() => {
    for (const incoming of snapshot.incomings) {
      db.runSync(
        `INSERT OR REPLACE INTO incomings
          (id, user_id, reference, value, origin, currency, category_id, created_at, updated_at, deleted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          incoming.id,
          incoming.user_id,
          incoming.reference,
          incoming.value !== null ? Number(incoming.value) : null,
          incoming.origin,
          incoming.currency,
          incoming.category_id,
          incoming.created_at,
          incoming.updated_at,
          incoming.deleted_at,
        ],
      );
    }

    for (const expense of snapshot.expenses) {
      db.runSync(
        `INSERT OR REPLACE INTO expenses
          (id, user_id, reference, value, destination, currency, category_id, due_date, payment_day, created_at, updated_at, deleted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          expense.id,
          expense.user_id,
          expense.reference,
          expense.value,
          expense.destination,
          expense.currency,
          expense.category_id,
          expense.due_date,
          expense.payment_day,
          expense.created_at,
          expense.updated_at,
          expense.deleted_at,
        ],
      );
    }
  });
}
