import { exportAllLocalData } from "@/lib/backup/export";
import { supabase } from "@/lib/supabase";
import { gzip } from "pako";

function jsonToGzipBytes(data: unknown): Uint8Array {
  const json = JSON.stringify(data);
  return gzip(json);
}

export async function uploadBackup(userId: string): Promise<void> {
  const snapshot = exportAllLocalData(userId);
  console.log("upload: exportedAt =", snapshot.exportedAt);
  console.log(
    "upload: incomings =",
    JSON.stringify(
      snapshot.incomings.map((i) => ({ id: i.id, value: i.value })),
    ),
  );

  const compressed = jsonToGzipBytes(snapshot);

  const { error } = await supabase.storage
    .from("backups")
    .upload(`${userId}/latest.json.gz`, compressed, {
      upsert: true,
      contentType: "application/gzip",
      cacheControl: "no-cache",
    });

  if (error) throw new Error(error.message);
  console.log("upload: done at", new Date().toISOString());
}
