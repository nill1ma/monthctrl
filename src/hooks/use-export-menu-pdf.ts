import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useState } from "react";

import type { ExportFilters } from "@/components/organisms/export-pdf-modal";
import { useAuth } from "@/context/auth";
import { buildExportPdfHtml } from "@/lib/pdf";
import { getDetailedTransactionsByReferences } from "@/services/list";
import type { DetailedTransaction } from "@/types/export";

export function useExportMenuPdf() {
  const { session } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  async function exportPdf(filters: ExportFilters) {
    if (!session?.user.id) return;
    setIsExporting(true);

    try {
      const { referenceStart, referenceEnd, transactionType, currencies } =
        filters;

      const allReferences = getReferencesInRange(referenceStart, referenceEnd);
      let data: DetailedTransaction[] =
        await getDetailedTransactionsByReferences(
          allReferences,
          session.user.id,
        );

      if (transactionType !== "all") {
        data = data.filter((row) => row.type === transactionType);
      }

      if (currencies !== "all") {
        data = data.filter((row) => currencies.includes(row.currency));
      }

      const html = buildExportPdfHtml(data, {
        referenceStart,
        referenceEnd,
        transactionType,
      });

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: `export-${referenceStart}-${referenceEnd}.pdf`,
        UTI: "com.adobe.pdf",
      });
    } finally {
      setIsExporting(false);
    }
  }

  return { exportPdf, isExporting };
}

function getReferencesInRange(start: string, end: string): string[] {
  const [startMonth, startYear] = parseReference(start);
  const [endMonth, endYear] = parseReference(end);

  const fromYear = Math.min(startYear, endYear);
  const fromMonth = startYear <= endYear ? startMonth : endMonth;
  const toYear = Math.max(startYear, endYear);
  const toMonth = startYear <= endYear ? endMonth : startMonth;

  const references: string[] = [];
  let month = fromMonth;
  let year = fromYear;

  while (year < toYear || (year === toYear && month <= toMonth)) {
    references.push(`${year}-${String(month).padStart(2, "0")}`);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return references;
}

function parseReference(ref: string): [number, number] {
  const [year, month] = ref.split("-").map(Number);
  return [month, year];
}
